'use client';

import * as React from 'react';
import { PortalContainerContext } from '../interactive/context.js';
import { cn } from 'cn';
import { Tooltip as TooltipPrimitive } from 'radix-ui';

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  const portalContainer = React.useContext(PortalContainerContext);
  return (
    <TooltipPrimitive.Portal container={portalContainer || undefined}>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'ib:z-50 ib:inline-flex ib:w-fit ib:max-w-xs ib:origin-(--radix-tooltip-content-transform-origin) ib:items-center ib:gap-1.5 ib:rounded-xl ib:bg-foreground ib:px-3 ib:py-1.5 ib:text-xs ib:text-background ib:has-data-[slot=kbd]:pr-1.5 ib:data-[side=bottom]:slide-in-from-top-2 ib:data-[side=left]:slide-in-from-right-2 ib:data-[side=right]:slide-in-from-left-2 ib:data-[side=top]:slide-in-from-bottom-2 ib:**:data-[slot=kbd]:relative ib:**:data-[slot=kbd]:isolate ib:**:data-[slot=kbd]:z-50 ib:**:data-[slot=kbd]:rounded-lg ib:data-[state=delayed-open]:animate-in ib:data-[state=delayed-open]:fade-in-0 ib:data-[state=delayed-open]:zoom-in-95 ib:data-open:animate-in ib:data-open:fade-in-0 ib:data-open:zoom-in-95 ib:data-closed:animate-out ib:data-closed:fade-out-0 ib:data-closed:zoom-out-95',
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="ib:z-50 ib:size-2.5 ib:translate-y-[calc(-50%_-_2px)] ib:rotate-45 ib:rounded-[2px] ib:bg-foreground ib:fill-foreground ib:data-[side=left]:translate-x-[-1.5px] ib:data-[side=right]:translate-x-[1.5px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
