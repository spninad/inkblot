'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import { Tabs as TabsPrimitive } from 'radix-ui';

function Tabs({
  className,
  orientation = 'horizontal',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn('ib:group/tabs ib:flex ib:gap-2 ib:data-horizontal:flex-col', className)}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  'ib:group/tabs-list ib:inline-flex ib:w-fit ib:items-center ib:justify-center ib:rounded-full ib:p-1 ib:text-muted-foreground ib:group-data-horizontal/tabs:h-9 ib:group-data-vertical/tabs:h-fit ib:group-data-vertical/tabs:flex-col ib:group-data-vertical/tabs:rounded-2xl ib:data-[variant=line]:rounded-none',
  {
    variants: {
      variant: {
        default: 'ib:bg-muted',
        line: 'ib:gap-1 ib:bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function TabsList({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'ib:relative ib:inline-flex ib:h-[calc(100%-1px)] ib:flex-1 ib:items-center ib:justify-center ib:gap-2 ib:rounded-full ib:border ib:border-transparent! ib:px-3 ib:py-1 ib:text-sm ib:font-medium ib:whitespace-nowrap ib:text-foreground/60 ib:transition-colors ib:group-data-vertical/tabs:w-full ib:group-data-vertical/tabs:justify-start ib:group-data-vertical/tabs:rounded-2xl ib:group-data-vertical/tabs:px-3 ib:group-data-vertical/tabs:py-1.5 ib:hover:text-foreground ib:focus-visible:border-ring ib:focus-visible:ring-[3px] ib:focus-visible:ring-ring/50 ib:focus-visible:outline-1 ib:focus-visible:outline-ring ib:disabled:pointer-events-none ib:disabled:opacity-50 ib:has-data-[icon=inline-end]:pr-2 ib:has-data-[icon=inline-start]:pl-2 ib:dark:text-muted-foreground ib:dark:hover:text-foreground ib:[&_svg]:pointer-events-none ib:[&_svg]:shrink-0 ib:[&_svg:not([class*=size-])]:size-4',
        'ib:group-data-[variant=line]/tabs-list:bg-transparent ib:group-data-[variant=line]/tabs-list:data-active:bg-transparent ib:dark:group-data-[variant=line]/tabs-list:data-active:border-transparent ib:dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent',
        'ib:data-active:bg-background ib:data-active:text-foreground ib:dark:data-active:border-input ib:dark:data-active:bg-input/30 ib:dark:data-active:text-foreground',
        'ib:after:absolute ib:after:bg-foreground ib:after:opacity-0 ib:after:transition-opacity ib:group-data-horizontal/tabs:after:inset-x-0 ib:group-data-horizontal/tabs:after:bottom-[-5px] ib:group-data-horizontal/tabs:after:h-0.5 ib:group-data-vertical/tabs:after:inset-y-0 ib:group-data-vertical/tabs:after:-right-1 ib:group-data-vertical/tabs:after:w-0.5 ib:group-data-[variant=line]/tabs-list:data-active:after:opacity-100',
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('ib:flex-1 ib:text-sm ib:outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
