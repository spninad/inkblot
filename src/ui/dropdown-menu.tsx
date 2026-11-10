'use client';

import * as React from 'react';
import { PortalContainerContext } from '../interactive/context.js';
import { cn } from 'cn';
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';

function DropdownMenu({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({
  className,
  align = 'start',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  const portalContainer = React.useContext(PortalContainerContext);
  return (
    <DropdownMenuPrimitive.Portal container={portalContainer || undefined}>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        align={align}
        className={cn(
          'ib:z-50 ib:max-h-(--radix-dropdown-menu-content-available-height) ib:w-(--radix-dropdown-menu-trigger-width) ib:min-w-48 ib:origin-(--radix-dropdown-menu-content-transform-origin) ib:overflow-x-hidden ib:overflow-y-auto ib:rounded-3xl ib:bg-popover ib:p-1.5 ib:text-popover-foreground ib:shadow-lg ib:ring-1 ib:ring-foreground/5 ib:duration-(--duration) ib:data-[side=bottom]:slide-in-from-top-2 ib:data-[side=left]:slide-in-from-right-2 ib:data-[side=right]:slide-in-from-left-2 ib:data-[side=top]:slide-in-from-bottom-2 ib:data-[state=closed]:overflow-hidden ib:dark:ring-foreground/10 ib:data-open:animate-in ib:data-open:fade-in-0 ib:data-open:zoom-in-95 ib:data-closed:animate-out ib:data-closed:fade-out-0 ib:data-closed:zoom-out-95',
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        'ib:group/dropdown-menu-item ib:relative ib:flex ib:cursor-default ib:items-center ib:gap-2.5 ib:rounded-2xl ib:px-3 ib:py-2 ib:text-sm ib:font-medium ib:outline-hidden ib:select-none ib:focus:bg-accent ib:focus:text-accent-foreground ib:not-data-[variant=destructive]:focus:**:text-accent-foreground ib:data-inset:pl-9.5 ib:data-[variant=destructive]:text-destructive ib:data-[variant=destructive]:focus:bg-destructive/10 ib:data-[variant=destructive]:focus:text-destructive ib:dark:data-[variant=destructive]:focus:bg-destructive/20 ib:data-disabled:pointer-events-none ib:data-disabled:opacity-50 ib:[&_svg]:pointer-events-none ib:[&_svg]:shrink-0 ib:[&_svg:not([class*=size-])]:size-4 ib:data-[variant=destructive]:*:[svg]:text-destructive',
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        'ib:relative ib:flex ib:cursor-default ib:items-center ib:gap-2.5 ib:rounded-2xl ib:py-2 ib:pr-8 ib:pl-3 ib:text-sm ib:font-medium ib:outline-hidden ib:select-none ib:focus:bg-accent ib:focus:text-accent-foreground ib:focus:**:text-accent-foreground ib:data-inset:pl-9.5 ib:data-disabled:pointer-events-none ib:data-disabled:opacity-50 ib:[&_svg]:pointer-events-none ib:[&_svg]:shrink-0 ib:[&_svg:not([class*=size-])]:size-4',
        className,
      )}
      checked={checked}
      {...props}
    >
      <span
        className="ib:pointer-events-none ib:absolute ib:right-2 ib:flex ib:items-center ib:justify-center"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(
        'ib:relative ib:flex ib:cursor-default ib:items-center ib:gap-2.5 ib:rounded-2xl ib:py-2 ib:pr-8 ib:pl-3 ib:text-sm ib:font-medium ib:outline-hidden ib:select-none ib:focus:bg-accent ib:focus:text-accent-foreground ib:focus:**:text-accent-foreground ib:data-inset:pl-9.5 ib:data-disabled:pointer-events-none ib:data-disabled:opacity-50 ib:[&_svg]:pointer-events-none ib:[&_svg]:shrink-0 ib:[&_svg:not([class*=size-])]:size-4',
        className,
      )}
      {...props}
    >
      <span
        className="ib:pointer-events-none ib:absolute ib:right-2 ib:flex ib:items-center ib:justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        'ib:px-3 ib:py-2.5 ib:text-xs ib:text-muted-foreground ib:data-inset:pl-9.5',
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn('ib:-mx-1.5 ib:my-1.5 ib:h-px ib:bg-border/50', className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        'ib:ml-auto ib:text-xs ib:tracking-widest ib:text-muted-foreground ib:group-focus/dropdown-menu-item:text-accent-foreground',
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSub({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        'ib:flex ib:cursor-default ib:items-center ib:gap-2 ib:rounded-2xl ib:px-3 ib:py-2 ib:text-sm ib:font-medium ib:outline-hidden ib:select-none ib:focus:bg-accent ib:focus:text-accent-foreground ib:not-data-[variant=destructive]:focus:**:text-accent-foreground ib:data-inset:pl-9.5 ib:data-open:bg-accent ib:data-open:text-accent-foreground ib:[&_svg]:pointer-events-none ib:[&_svg]:shrink-0 ib:[&_svg:not([class*=size-])]:size-4',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ib:ml-auto" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        'ib:z-50 ib:min-w-36 ib:origin-(--radix-dropdown-menu-content-transform-origin) ib:overflow-hidden ib:rounded-3xl ib:bg-popover ib:p-1.5 ib:text-popover-foreground ib:shadow-lg ib:ring-1 ib:ring-foreground/5 ib:duration-(--duration) ib:data-[side=bottom]:slide-in-from-top-2 ib:data-[side=left]:slide-in-from-right-2 ib:data-[side=right]:slide-in-from-left-2 ib:data-[side=top]:slide-in-from-bottom-2 ib:dark:ring-foreground/10 ib:data-open:animate-in ib:data-open:fade-in-0 ib:data-open:zoom-in-95 ib:data-closed:animate-out ib:data-closed:fade-out-0 ib:data-closed:zoom-out-95',
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
