'use client';

import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { cn } from 'cn';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/ui/dialog';
import { InputGroup, InputGroupAddon } from '@/ui/input-group';
import { SearchIcon, CheckIcon } from 'lucide-react';

function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        'ib:flex ib:size-full ib:flex-col ib:overflow-hidden ib:rounded-4xl ib:bg-popover ib:p-1 ib:text-popover-foreground',
        className,
      )}
      {...props}
    />
  );
}

function CommandDialog({
  title = 'Command Palette',
  description = 'Search for a command to run...',
  children,
  className,
  showCloseButton = false,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="ib:sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          'ib:top-1/3 ib:translate-y-0 ib:overflow-hidden ib:rounded-4xl! ib:p-0',
          className,
        )}
        showCloseButton={showCloseButton}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(props.ref, () => inputRef.current!);
  // Async result insertion can leave cmdk's selectedItemId unset. Keep the
  // combobox's accessible active descendant aligned with its selected option.
  React.useEffect(() => {
    const root = inputRef.current?.closest('[cmdk-root]');
    if (!root) return;
    const sync = () => {
      const selected = root.querySelector<HTMLElement>('[cmdk-item][aria-selected="true"]');
      if (selected) inputRef.current?.setAttribute('aria-activedescendant', selected.id);
      else inputRef.current?.removeAttribute('aria-activedescendant');
    };
    const observer = new MutationObserver(sync);
    observer.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['aria-selected'],
    });
    sync();
    return () => observer.disconnect();
  }, []);
  return (
    <div data-slot="command-input-wrapper" className="ib:p-1 ib:pb-0">
      <InputGroup className="ib:h-9 ib:bg-input/50">
        <CommandPrimitive.Input
          data-slot="command-input"
          className={cn(
            'ib:w-full ib:text-sm ib:outline-hidden ib:disabled:cursor-not-allowed ib:disabled:opacity-50',
            className,
          )}
          {...props}
          ref={inputRef}
        />
        <InputGroupAddon>
          <SearchIcon className="ib:size-4 ib:shrink-0 ib:opacity-50" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        'ib:no-scrollbar ib:max-h-72 ib:scroll-py-1 ib:overflow-x-hidden ib:overflow-y-auto ib:outline-none',
        className,
      )}
      {...props}
    />
  );
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn('ib:py-6 ib:text-center ib:text-sm', className)}
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        'ib:overflow-hidden ib:p-1.5 ib:text-foreground ib:**:[[cmdk-group-heading]]:px-3 ib:**:[[cmdk-group-heading]]:py-2 ib:**:[[cmdk-group-heading]]:text-xs ib:**:[[cmdk-group-heading]]:font-medium ib:**:[[cmdk-group-heading]]:text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn('ib:my-1.5 ib:h-px ib:bg-border/50', className)}
      {...props}
    />
  );
}

function CommandItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        'ib:group/command-item ib:relative ib:flex ib:cursor-default ib:items-center ib:gap-2 ib:rounded-2xl ib:px-3 ib:py-2 ib:text-sm ib:font-medium ib:outline-hidden ib:select-none ib:in-data-[slot=dialog-content]:rounded-3xl ib:data-[disabled=true]:pointer-events-none ib:data-[disabled=true]:opacity-50 ib:data-selected:bg-muted ib:data-selected:text-foreground ib:[&_svg]:pointer-events-none ib:[&_svg]:shrink-0 ib:[&_svg:not([class*=size-])]:size-4 ib:data-selected:*:[svg]:text-foreground',
        className,
      )}
      {...props}
    >
      {children}
      <CheckIcon className="ib:ml-auto ib:opacity-0 ib:group-has-data-[slot=command-shortcut]/command-item:hidden ib:group-data-[checked=true]/command-item:opacity-100" />
    </CommandPrimitive.Item>
  );
}

function CommandShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        'ib:ml-auto ib:text-xs ib:tracking-widest ib:text-muted-foreground ib:group-data-selected/command-item:text-foreground',
        className,
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
