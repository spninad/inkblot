import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';

const alertVariants = cva(
  'ib:group/alert ib:relative ib:grid ib:w-full ib:gap-0.5 ib:rounded-2xl ib:border ib:px-4 ib:py-3 ib:text-left ib:text-sm ib:has-data-[slot=alert-action]:relative ib:has-data-[slot=alert-action]:pr-18 ib:has-[>svg]:grid-cols-[auto_1fr] ib:has-[>svg]:gap-x-2.5 ib:*:[svg]:row-span-2 ib:*:[svg]:translate-y-0.5 ib:*:[svg]:text-current ib:*:[svg:not([class*=size-])]:size-4',
  {
    variants: {
      variant: {
        default: 'ib:bg-card ib:text-card-foreground',
        destructive:
          'ib:bg-card ib:text-destructive ib:*:data-[slot=alert-description]:text-destructive/90 ib:*:[svg]:text-current',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'ib:font-medium ib:group-has-[>svg]/alert:col-start-2 ib:[&_a]:underline ib:[&_a]:underline-offset-3 ib:[&_a]:hover:text-foreground',
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'ib:text-sm ib:text-balance ib:text-muted-foreground ib:md:text-pretty ib:[&_a]:underline ib:[&_a]:underline-offset-3 ib:[&_a]:hover:text-foreground ib:[&_p:not(:last-child)]:mb-4',
        className,
      )}
      {...props}
    />
  );
}

function AlertAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-action"
      className={cn('ib:absolute ib:top-2.5 ib:right-3', className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, AlertAction };
