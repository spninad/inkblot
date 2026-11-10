/**
 * Inkblot Three.js 3D Scientific Visualization Runtime
 * Renders 3D loss landscapes, trajectory rollouts, and latent manifolds.
 */

export const INKBLOT_THREE_SCRIPT = `
(function() {
  function init3DPlots() {
    var containers = document.querySelectorAll('[data-plot3d]');
    if (!containers.length) return;

    if (typeof window.THREE === 'undefined') {
      if (document.querySelector('script[data-inkblot-three]')) return;
      var script = document.createElement('script');
      script.setAttribute('data-inkblot-three', '');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = function() { initAllScenes(); };
      script.onerror = function() { document.querySelectorAll('.inkblot-3d-fallback').forEach(function(n) { n.textContent = '3D preview unavailable. Check your connection and reload.'; }); };
      document.head.appendChild(script);
    } else {
      initAllScenes();
    }
  }

  function initAllScenes() {
    var containers = document.querySelectorAll('[data-plot3d]');
    containers.forEach(function(wrap) {
      if (wrap._threeInit) return;
      wrap._threeInit = true;
      var type = wrap.getAttribute('data-plot3d');
      try {
      if (type === 'latent-manifold') {
        renderLatentManifold(wrap);
      } else {
        renderLossSurface(wrap);
      }
      } catch(e) { var fallback = wrap.querySelector('.inkblot-3d-fallback'); if (fallback) { fallback.style.display = 'flex'; fallback.textContent = '3D preview unavailable in this browser.'; } }
    });
  }

  function renderLossSurface(wrap) {
    var W = wrap.clientWidth || 600;
    var H = wrap.clientHeight || 420;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
    camera.position.set(24, 28, 36);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    var fallback = wrap.querySelector('.inkblot-3d-fallback');
    if (fallback) fallback.style.display = 'none';

    wrap.appendChild(renderer.domElement);

    // Ambient and directional lighting
    var ambient = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambient);
    var dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(20, 40, 20);
    scene.add(dirLight);

    // Parametric surface: loss landscape with saddle and minimum
    var size = 28;
    var segs = 48;
    var geom = new THREE.PlaneGeometry(size, size, segs, segs);
    geom.rotateX(-Math.PI / 2);

    var pos = geom.attributes.position;
    var colors = [];
    var colMin = new THREE.Color('#2a78d6'); // Academic blue
    var colMax = new THREE.Color('#eb6834'); // Terracotta ridge
    var colMid = new THREE.Color('#ececea'); // Neutral

    for (var i = 0; i < pos.count; i++) {
      var x = pos.getX(i);
      var z = pos.getZ(i);
      // Scientific non-convex landscape with global basin
      var r2 = (x * x + z * z) / 80;
      var y = 2.4 * Math.sin(x * 0.35) * Math.cos(z * 0.35) + 0.12 * (x * x + z * z) * 0.08 - 2.5 * Math.exp(-r2 * 1.5);
      pos.setY(i, y);

      // Height coloring
      var normH = (y + 3) / 6;
      normH = Math.max(0, Math.min(1, normH));
      var c = normH < 0.5 ? colMin.clone().lerp(colMid, normH * 2) : colMid.clone().lerp(colMax, (normH - 0.5) * 2);
      colors.push(c.r, c.g, c.b);
    }
    geom.computeVertexNormals();
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    var mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.35,
      metalness: 0.1,
      wireframe: false,
      side: THREE.DoubleSide
    });
    var mesh = new THREE.Mesh(geom, mat);
    scene.add(mesh);

    // Wireframe overlay
    var wireMat = new THREE.MeshBasicMaterial({ color: 0x8b8b91, wireframe: true, transparent: true, opacity: 0.15 });
    var wireMesh = new THREE.Mesh(geom, wireMat);
    scene.add(wireMesh);

    // Gradient descent trajectory path
    var curvePoints = [
      new THREE.Vector3(-10, 4.2, -9),
      new THREE.Vector3(-7, 2.5, -6),
      new THREE.Vector3(-4, 0.8, -3),
      new THREE.Vector3(-1, -0.6, -1),
      new THREE.Vector3(0.5, -2.2, 0.5)
    ];
    var curve = new THREE.CatmullRomCurve3(curvePoints);
    var tubeGeom = new THREE.TubeGeometry(curve, 40, 0.28, 8, false);
    var tubeMat = new THREE.MeshBasicMaterial({ color: 0x1baf7a }); // Forest green optimal rollout
    var tube = new THREE.Mesh(tubeGeom, tubeMat);
    scene.add(tube);

    // Candidate rejected trajectories
    var altPoints = [
      new THREE.Vector3(-10, 4.2, -9),
      new THREE.Vector3(-6, 3.1, -11),
      new THREE.Vector3(-2, 2.4, -12),
      new THREE.Vector3(3, 3.6, -10)
    ];
    var altCurve = new THREE.CatmullRomCurve3(altPoints);
    var altTubeGeom = new THREE.TubeGeometry(altCurve, 30, 0.18, 6, false);
    var altMat = new THREE.MeshBasicMaterial({ color: 0x8b8b91, transparent: true, opacity: 0.45 });
    scene.add(new THREE.Mesh(altTubeGeom, altMat));

    // Animated pulsing agent particle
    var dotGeom = new THREE.SphereGeometry(0.55, 16, 16);
    var dotMat = new THREE.MeshBasicMaterial({ color: 0xeb6834 });
    var dot = new THREE.Mesh(dotGeom, dotMat);
    scene.add(dot);

    // Camera Orbit State
    var isDragging = false;
    var prevMouse = { x: 0, y: 0 };
    var spherical = { radius: 46, theta: 0.7, phi: 1.1 };
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var autoRotate = !reducedMotion.matches;
    var events = new AbortController();
    function listen(target, type, listener, options) { target.addEventListener(type, listener, Object.assign({}, options, { signal: events.signal })); }
    var visible = true;
    var visibilityObserver = new IntersectionObserver(function(entries) { visible = entries[0].isIntersecting; });
    visibilityObserver.observe(wrap);
    var sizeObserver = new ResizeObserver(function() { var w = wrap.clientWidth, h = wrap.clientHeight; if (w && h) { camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h); } });
    sizeObserver.observe(wrap);

    function updateCamera() {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 0, 0);
    }
    updateCamera();

    // Mouse drag controls
    listen(renderer.domElement, 'pointerdown', function(e) {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    });
    listen(window, 'pointermove', function(e) {
      if (!isDragging) return;
      var dx = e.clientX - prevMouse.x;
      var dy = e.clientY - prevMouse.y;
      prevMouse = { x: e.clientX, y: e.clientY };
      spherical.theta -= dx * 0.008;
      spherical.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, spherical.phi - dy * 0.008));
      updateCamera();
    });
    listen(window, 'pointerup', function() { isDragging = false; });
    listen(window, 'pointercancel', function() { isDragging = false; });

    // Wheel zoom
    listen(renderer.domElement, 'wheel', function(e) {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      spherical.radius = Math.max(15, Math.min(90, spherical.radius + e.deltaY * 0.05));
      updateCamera();
    }, { passive: false });

    // Buttons
    var rotBtn = wrap.querySelector('[data-3d-action="rotate"]');
    function syncRotation() { if (rotBtn) rotBtn.setAttribute('aria-pressed', String(autoRotate)); }
    syncRotation();
    listen(reducedMotion, 'change', function() { autoRotate = !reducedMotion.matches; syncRotation(); });
    if (rotBtn) listen(rotBtn, 'click', function() { autoRotate = !autoRotate; syncRotation(); });
    var resetBtn = wrap.querySelector('[data-3d-action="reset"]');
    if (resetBtn) listen(resetBtn, 'click', function() {
      spherical = { radius: 46, theta: 0.7, phi: 1.1 };
      updateCamera();
    });

    // Animation loop
    var t = 0;
    function animate() {
      if (!wrap.isConnected) {
        events.abort(); visibilityObserver.disconnect(); sizeObserver.disconnect();
        scene.traverse(function(node) { if (node.geometry) node.geometry.dispose(); if (node.material) { var materials = Array.isArray(node.material) ? node.material : [node.material]; materials.forEach(function(m) { m.dispose(); }); } });
        renderer.dispose(); return;
      }
      requestAnimationFrame(animate);
      if (!visible || document.hidden) return;
      if (autoRotate) t += 0.006;
      if (autoRotate && !isDragging) {
        spherical.theta += 0.003;
        updateCamera();
      }
      var loopT = (t * 0.6) % 1;
      var p = curve.getPoint(loopT);
      dot.position.copy(p);
      renderer.render(scene, camera);
    }
    animate();

    listen(window, 'resize', function() {
      var nw = wrap.clientWidth;
      var nh = wrap.clientHeight;
      if (nw && nh) {
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      }
    });
  }

  function renderLatentManifold(wrap) {
    var W = wrap.clientWidth || 600;
    var H = wrap.clientHeight || 420;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
    camera.position.set(0, 15, 35);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    var fallback = wrap.querySelector('.inkblot-3d-fallback');
    if (fallback) fallback.style.display = 'none';

    wrap.appendChild(renderer.domElement);

    // Clustered token latent states
    var particleCount = 260;
    var geom = new THREE.BufferGeometry();
    var positions = [];
    var colors = [];

    var clusters = [
      { center: [-6, 3, 0], color: new THREE.Color('#2a78d6') },  // Cluster A: JEPA Encoder
      { center: [6, -2, 2], color: new THREE.Color('#eb6834') },  // Cluster B: Diffusion Planners
      { center: [0, -4, -5], color: new THREE.Color('#1baf7a') }  // Cluster C: Policy Priors
    ];

    for (var i = 0; i < particleCount; i++) {
      var cl = clusters[i % clusters.length];
      var rx = (Math.random() - 0.5) * 5.5 + cl.center[0];
      var ry = (Math.random() - 0.5) * 4.5 + cl.center[1];
      var rz = (Math.random() - 0.5) * 5.5 + cl.center[2];
      positions.push(rx, ry, rz);
      colors.push(cl.color.r, cl.color.g, cl.color.b);
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    var mat = new THREE.PointsMaterial({ size: 0.6, vertexColors: true, transparent: true, opacity: 0.85 });
    var points = new THREE.Points(geom, mat);
    scene.add(points);

    // Subtle grid base
    var grid = new THREE.GridHelper(30, 20, 0x8b8b91, 0xe6e6e3);
    grid.position.y = -8;
    scene.add(grid);

    // Orbit state
    var isDragging = false;
    var prevMouse = { x: 0, y: 0 };
    var spherical = { radius: 38, theta: 0.2, phi: 1.2 };
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var autoRotate = !reducedMotion.matches;
    var events = new AbortController();
    function listen(target, type, listener, options) { target.addEventListener(type, listener, Object.assign({}, options, { signal: events.signal })); }
    var visible = true;
    var visibilityObserver = new IntersectionObserver(function(entries) { visible = entries[0].isIntersecting; });
    visibilityObserver.observe(wrap);
    var sizeObserver = new ResizeObserver(function() { var w = wrap.clientWidth, h = wrap.clientHeight; if (w && h) { camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h); } });
    sizeObserver.observe(wrap);

    function updateCamera() {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 0, 0);
    }
    updateCamera();

    listen(renderer.domElement, 'pointerdown', function(e) {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    });
    listen(window, 'pointermove', function(e) {
      if (!isDragging) return;
      var dx = e.clientX - prevMouse.x;
      var dy = e.clientY - prevMouse.y;
      prevMouse = { x: e.clientX, y: e.clientY };
      spherical.theta -= dx * 0.008;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi - dy * 0.008));
      updateCamera();
    });
    listen(window, 'pointerup', function() { isDragging = false; });
    listen(window, 'pointercancel', function() { isDragging = false; });

    listen(renderer.domElement, 'wheel', function(e) {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      spherical.radius = Math.max(12, Math.min(70, spherical.radius + e.deltaY * 0.05));
      updateCamera();
    }, { passive: false });

    var rotBtn = wrap.querySelector('[data-3d-action="rotate"]');
    function syncRotation() { if (rotBtn) rotBtn.setAttribute('aria-pressed', String(autoRotate)); }
    syncRotation();
    listen(reducedMotion, 'change', function() { autoRotate = !reducedMotion.matches; syncRotation(); });
    if (rotBtn) listen(rotBtn, 'click', function() { autoRotate = !autoRotate; syncRotation(); });
    var resetBtn = wrap.querySelector('[data-3d-action="reset"]');
    if (resetBtn) listen(resetBtn, 'click', function() { spherical = { radius: 38, theta: 0.2, phi: 1.2 }; updateCamera(); });

    function animate() {
      if (!wrap.isConnected) {
        events.abort(); visibilityObserver.disconnect(); sizeObserver.disconnect();
        scene.traverse(function(node) { if (node.geometry) node.geometry.dispose(); if (node.material) { var materials = Array.isArray(node.material) ? node.material : [node.material]; materials.forEach(function(m) { m.dispose(); }); } });
        renderer.dispose(); return;
      }
      requestAnimationFrame(animate);
      if (!visible || document.hidden) return;
      if (autoRotate && !isDragging) {
        spherical.theta += 0.002;
        updateCamera();
      }
      renderer.render(scene, camera);
    }
    animate();
  }

  document.addEventListener('inkblot:content-ready', init3DPlots);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3DPlots);
  } else {
    init3DPlots();
  }
})();
`.trim();
