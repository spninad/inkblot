import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import { Slot } from 'radix-ui';

const badgeVariants = cva(
  'ib:group/badge ib:inline-flex ib:h-5 ib:w-fit ib:shrink-0 ib:items-center ib:justify-center ib:gap-1 ib:overflow-hidden ib:rounded-3xl ib:border ib:border-transparent ib:px-2 ib:py-0.5 ib:text-xs ib:font-medium ib:whitespace-nowrap ib:transition-colors ib:focus-visible:border-ring ib:focus-visible:ring-[3px] ib:focus-visible:ring-ring/50 ib:has-data-[icon=inline-end]:pr-1.5 ib:has-data-[icon=inline-start]:pl-1.5 ib:aria-invalid:border-destructive ib:aria-invalid:ring-destructive/20 ib:dark:aria-invalid:ring-destructive/40 ib:[&>svg]:pointer-events-none ib:[&>svg]:size-3!',
  {
    variants: {
      variant: {
        default: 'ib:bg-primary ib:text-primary-foreground ib:[a]:hover:bg-primary/80',
        secondary: 'ib:bg-secondary ib:text-secondary-foreground ib:[a]:hover:bg-secondary/80',
        destructive:
          'ib:bg-destructive/10 ib:text-destructive ib:focus-visible:ring-destructive/20 ib:dark:bg-destructive/20 ib:dark:focus-visible:ring-destructive/40 ib:[a]:hover:bg-destructive/20',
        outline:
          'ib:border-border ib:text-foreground ib:[a]:hover:bg-muted ib:[a]:hover:text-muted-foreground',
        ghost: 'ib:hover:bg-muted ib:hover:text-muted-foreground ib:dark:hover:bg-muted/50',
        link: 'ib:text-primary ib:underline-offset-4 ib:hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span';

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
