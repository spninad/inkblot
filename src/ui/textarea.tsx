import * as React from 'react';
import { cn } from 'cn';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'ib:flex ib:field-sizing-content ib:min-h-16 ib:w-full ib:resize-none ib:rounded-2xl ib:border ib:border-transparent ib:bg-input/50 ib:px-3 ib:py-3 ib:text-base ib:transition-[color,box-shadow,background-color] ib:outline-none ib:placeholder:text-muted-foreground ib:focus-visible:border-ring ib:focus-visible:ring-3 ib:focus-visible:ring-ring/30 ib:disabled:cursor-not-allowed ib:disabled:opacity-50 ib:aria-invalid:border-destructive ib:aria-invalid:ring-3 ib:aria-invalid:ring-destructive/20 ib:md:text-sm ib:dark:aria-invalid:border-destructive/50 ib:dark:aria-invalid:ring-destructive/40',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
