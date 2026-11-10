'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';

import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Textarea } from '@/ui/textarea';

function InputGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        'ib:group/input-group ib:relative ib:flex ib:h-9 ib:w-full ib:min-w-0 ib:items-center ib:rounded-4xl ib:border ib:border-transparent ib:bg-input/50 ib:transition-[color,box-shadow,background-color] ib:outline-none ib:in-data-[slot=combobox-content]:focus-within:border-inherit ib:in-data-[slot=combobox-content]:focus-within:ring-0 ib:has-data-[align=block-end]:rounded-3xl ib:has-data-[align=block-start]:rounded-3xl ib:has-[[data-slot=input-group-control]:focus-visible]:border-ring ib:has-[[data-slot=input-group-control]:focus-visible]:ring-3 ib:has-[[data-slot=input-group-control]:focus-visible]:ring-ring/30 ib:has-[[data-slot][aria-invalid=true]]:border-destructive ib:has-[[data-slot][aria-invalid=true]]:ring-3 ib:has-[[data-slot][aria-invalid=true]]:ring-destructive/20 ib:has-[textarea]:rounded-2xl ib:has-[>[data-align=block-end]]:h-auto ib:has-[>[data-align=block-end]]:flex-col ib:has-[>[data-align=block-start]]:h-auto ib:has-[>[data-align=block-start]]:flex-col ib:has-[>textarea]:h-auto ib:dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 ib:has-[>[data-align=block-end]]:[&>input]:pt-3 ib:has-[>[data-align=block-start]]:[&>input]:pb-3 ib:has-[>[data-align=inline-end]]:[&>input]:pr-1.5 ib:has-[>[data-align=inline-start]]:[&>input]:pl-1.5',
        className,
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  'ib:flex ib:h-auto ib:cursor-text ib:items-center ib:justify-center ib:gap-2 ib:py-2 ib:text-sm ib:font-medium ib:text-muted-foreground ib:select-none ib:group-data-[disabled=true]/input-group:opacity-50 ib:**:data-[slot=kbd]:rounded-3xl ib:**:data-[slot=kbd]:bg-muted-foreground/10 ib:**:data-[slot=kbd]:px-1.5 ib:[&>svg:not([class*=size-])]:size-4',
  {
    variants: {
      align: {
        'inline-start': 'ib:order-first ib:pl-3 ib:has-[>button]:-ml-1 ib:has-[>kbd]:-ml-1',
        'inline-end': 'ib:order-last ib:pr-3 ib:has-[>button]:-mr-1 ib:has-[>kbd]:-mr-1',
        'block-start':
          'ib:order-first ib:w-full ib:justify-start ib:px-3 ib:pt-3 ib:group-has-[>input]/input-group:pt-3.5 ib:[.border-b]:pb-3.5',
        'block-end':
          'ib:order-last ib:w-full ib:justify-start ib:px-3 ib:pb-3 ib:group-has-[>input]/input-group:pb-3.5 ib:[.border-t]:pt-3.5',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  },
);

function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) {
          return;
        }
        e.currentTarget.parentElement?.querySelector('input')?.focus();
      }}
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva(
  'ib:flex ib:items-center ib:gap-2 ib:rounded-4xl ib:text-sm ib:shadow-none',
  {
    variants: {
      size: {
        xs: 'ib:h-6 ib:gap-1 ib:rounded-xl ib:px-1.5 ib:[&>svg:not([class*=size-])]:size-3.5',
        sm: 'ib:',
        'icon-xs': 'ib:size-6 ib:rounded-xl ib:p-0 ib:has-[>svg]:p-0',
        'icon-sm': 'ib:size-8 ib:p-0 ib:has-[>svg]:p-0',
      },
    },
    defaultVariants: {
      size: 'xs',
    },
  },
);

function InputGroupButton({
  className,
  type = 'button',
  variant = 'ghost',
  size = 'xs',
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'size'> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'ib:flex ib:items-center ib:gap-2 ib:text-sm ib:text-muted-foreground ib:[&_svg]:pointer-events-none ib:[&_svg:not([class*=size-])]:size-4',
        className,
      )}
      {...props}
    />
  );
}

function InputGroupInput({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        'ib:flex-1 ib:rounded-none ib:border-0 ib:bg-transparent ib:shadow-none ib:ring-0 ib:focus-visible:ring-0 ib:aria-invalid:ring-0 ib:dark:bg-transparent',
        className,
      )}
      {...props}
    />
  );
}

function InputGroupTextarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        'ib:flex-1 ib:resize-none ib:rounded-none ib:border-0 ib:bg-transparent ib:py-2.5 ib:shadow-none ib:ring-0 ib:focus-visible:ring-0 ib:aria-invalid:ring-0 ib:dark:bg-transparent',
        className,
      )}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
};
