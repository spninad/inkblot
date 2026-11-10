import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import { Slot } from 'radix-ui';

const buttonVariants = cva(
  'ib:group/button ib:inline-flex ib:shrink-0 ib:items-center ib:justify-center ib:rounded-4xl ib:border ib:border-transparent ib:bg-clip-padding ib:text-sm ib:font-medium ib:whitespace-nowrap ib:transition-colors ib:outline-none ib:select-none ib:focus-visible:border-ring ib:focus-visible:ring-3 ib:focus-visible:ring-ring/30 ib:active:not-aria-[haspopup]:translate-y-px ib:disabled:pointer-events-none ib:disabled:opacity-50 ib:aria-invalid:border-destructive ib:aria-invalid:ring-3 ib:aria-invalid:ring-destructive/20 ib:dark:aria-invalid:border-destructive/50 ib:dark:aria-invalid:ring-destructive/40 ib:[&_svg]:pointer-events-none ib:[&_svg]:shrink-0 ib:[&_svg:not([class*=size-])]:size-4',
  {
    variants: {
      variant: {
        default: 'ib:bg-primary ib:text-primary-foreground ib:hover:bg-primary/80',
        outline:
          'ib:border-border ib:bg-background ib:hover:bg-muted ib:hover:text-foreground ib:aria-expanded:bg-muted ib:aria-expanded:text-foreground ib:dark:bg-transparent ib:dark:hover:bg-input/30',
        secondary:
          'ib:bg-secondary ib:text-secondary-foreground ib:hover:bg-[color-mix(in_oklch,var(--ib-secondary),var(--ib-foreground)_5%)] ib:aria-expanded:bg-secondary ib:aria-expanded:text-secondary-foreground',
        ghost:
          'ib:hover:bg-muted ib:hover:text-foreground ib:aria-expanded:bg-muted ib:aria-expanded:text-foreground ib:dark:hover:bg-muted/50',
        destructive:
          'ib:bg-destructive/10 ib:text-destructive ib:hover:bg-destructive/20 ib:focus-visible:border-destructive/40 ib:focus-visible:ring-destructive/20 ib:dark:bg-destructive/20 ib:dark:hover:bg-destructive/30 ib:dark:focus-visible:ring-destructive/40',
        link: 'ib:text-primary ib:underline-offset-4 ib:hover:underline',
      },
      size: {
        default:
          'ib:h-9 ib:gap-1.5 ib:px-3 ib:has-data-[icon=inline-end]:pr-2.5 ib:has-data-[icon=inline-start]:pl-2.5',
        xs: 'ib:h-6 ib:gap-1 ib:px-2.5 ib:text-xs ib:has-data-[icon=inline-end]:pr-2 ib:has-data-[icon=inline-start]:pl-2 ib:[&_svg:not([class*=size-])]:size-3',
        sm: 'ib:h-8 ib:gap-1 ib:px-3 ib:has-data-[icon=inline-end]:pr-2 ib:has-data-[icon=inline-start]:pl-2',
        lg: 'ib:h-10 ib:gap-1.5 ib:px-4 ib:has-data-[icon=inline-end]:pr-3 ib:has-data-[icon=inline-start]:pl-3',
        icon: 'ib:size-9',
        'icon-xs': 'ib:size-6 ib:[&_svg:not([class*=size-])]:size-3',
        'icon-sm': 'ib:size-8',
        'icon-lg': 'ib:size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
