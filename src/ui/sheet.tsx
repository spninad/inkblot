'use client';

import * as React from 'react';
import { PortalContainerContext } from '../interactive/context.js';
import { cn } from 'cn';
import { Dialog as SheetPrimitive } from 'radix-ui';

import { Button } from '@/ui/button';
import { XIcon } from 'lucide-react';

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        'ib:fixed ib:inset-0 ib:z-50 ib:bg-black/30 ib:duration-(--duration) ib:supports-backdrop-filter:backdrop-blur-sm ib:data-open:animate-in ib:data-open:fade-in-0 ib:data-closed:animate-out ib:data-closed:fade-out-0',
        className,
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = 'right',
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left';
  showCloseButton?: boolean;
}) {
  const portalContainer = React.useContext(PortalContainerContext);
  return (
    <SheetPortal container={portalContainer || undefined}>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          'ib:fixed ib:z-50 ib:flex ib:flex-col ib:bg-popover ib:bg-clip-padding ib:text-sm ib:text-popover-foreground ib:shadow-xl ib:transition ib:duration-(--duration) ib:ease-(--ease) ib:data-[side=bottom]:inset-x-0 ib:data-[side=bottom]:bottom-0 ib:data-[side=bottom]:h-auto ib:data-[side=bottom]:border-t ib:data-[side=left]:inset-y-0 ib:data-[side=left]:left-0 ib:data-[side=left]:h-full ib:data-[side=left]:w-3/4 ib:data-[side=left]:border-r ib:data-[side=right]:inset-y-0 ib:data-[side=right]:right-0 ib:data-[side=right]:h-full ib:data-[side=right]:w-3/4 ib:data-[side=right]:border-l ib:data-[side=top]:inset-x-0 ib:data-[side=top]:top-0 ib:data-[side=top]:h-auto ib:data-[side=top]:border-b ib:data-[side=left]:sm:max-w-sm ib:data-[side=right]:sm:max-w-sm ib:data-open:animate-in ib:data-open:fade-in-0 ib:data-[side=bottom]:data-open:slide-in-from-bottom-10 ib:data-[side=left]:data-open:slide-in-from-left-10 ib:data-[side=right]:data-open:slide-in-from-right-10 ib:data-[side=top]:data-open:slide-in-from-top-10 ib:data-closed:animate-out ib:data-closed:fade-out-0 ib:data-[side=bottom]:data-closed:slide-out-to-bottom-10 ib:data-[side=left]:data-closed:slide-out-to-left-10 ib:data-[side=right]:data-closed:slide-out-to-right-10 ib:data-[side=top]:data-closed:slide-out-to-top-10',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close data-slot="sheet-close" asChild>
            <Button
              variant="ghost"
              className="ib:absolute ib:top-4 ib:right-4 ib:bg-secondary"
              size="icon-sm"
            >
              <XIcon />
              <span className="ib:sr-only">Close</span>
            </Button>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('ib:flex ib:flex-col ib:gap-1.5 ib:p-6', className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('ib:mt-auto ib:flex ib:flex-col ib:gap-2 ib:p-6', className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn('ib: ib:text-base ib:font-medium ib:text-foreground', className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn('ib:text-sm ib:text-muted-foreground', className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
