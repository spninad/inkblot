import type React from 'react';
import { TabsControl, CollapseControl } from './tabs.js';
import { SiteControls, AppearanceControls } from './toolbar.js';
export const controlRegistry: Record<string, React.ComponentType<any>> = {
  tabs: TabsControl,
  collapse: CollapseControl,
  toolbar: SiteControls,
  appearance: AppearanceControls,
};
