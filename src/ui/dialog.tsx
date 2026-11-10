'use client';

import * as React from 'react';
import { PortalContainerContext } from '../interactive/context.js';
import { cn } from 'cn';
import { Dialog as DialogPrimitive } from 'radix-ui';

import { Button } from '@/ui/button';
import { XIcon } from 'lucide-react';

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'ib:fixed ib:inset-0 ib:isolate ib:z-50 ib:bg-black/30 ib:duration-(--duration) ib:supports-backdrop-filter:backdrop-blur-sm ib:data-open:animate-in ib:data-open:fade-in-0 ib:data-closed:animate-out ib:data-closed:fade-out-0',
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  const portalContainer = React.useContext(PortalContainerContext);
  return (
    <DialogPortal container={portalContainer || undefined}>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'ib:fixed ib:top-1/2 ib:left-1/2 ib:z-50 ib:grid ib:w-full ib:max-w-[calc(100%-2rem)] ib:-translate-x-1/2 ib:-translate-y-1/2 ib:gap-6 ib:rounded-4xl ib:bg-popover ib:p-6 ib:text-sm ib:text-popover-foreground ib:shadow-xl ib:ring-1 ib:ring-foreground/5 ib:duration-(--duration) ib:outline-none ib:sm:max-w-md ib:dark:ring-foreground/10 ib:data-open:animate-in ib:data-open:fade-in-0 ib:data-open:zoom-in-95 ib:data-closed:animate-out ib:data-closed:fade-out-0 ib:data-closed:zoom-out-95',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close data-slot="dialog-close" asChild>
            <Button
              variant="ghost"
              className="ib:absolute ib:top-4 ib:right-4 ib:bg-secondary"
              size="icon-sm"
            >
              <XIcon />
              <span className="ib:sr-only">Close</span>
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('ib:flex ib:flex-col ib:gap-1.5', className)}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'ib:flex ib:flex-col-reverse ib:gap-2 ib:sm:flex-row ib:sm:justify-end',
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('ib: ib:text-base ib:leading-none ib:font-medium', className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        'ib:text-sm ib:text-muted-foreground ib:*:[a]:underline ib:*:[a]:underline-offset-3 ib:*:[a]:hover:text-foreground',
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
