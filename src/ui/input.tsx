import * as React from 'react';
import { cn } from 'cn';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'ib:h-9 ib:w-full ib:min-w-0 ib:rounded-3xl ib:border ib:border-transparent ib:bg-input/50 ib:px-3 ib:py-1 ib:text-base ib:transition-[color,box-shadow,background-color] ib:outline-none ib:file:inline-flex ib:file:h-7 ib:file:border-0 ib:file:bg-transparent ib:file:text-sm ib:file:font-medium ib:file:text-foreground ib:placeholder:text-muted-foreground ib:focus-visible:border-ring ib:focus-visible:ring-3 ib:focus-visible:ring-ring/30 ib:disabled:pointer-events-none ib:disabled:cursor-not-allowed ib:disabled:opacity-50 ib:aria-invalid:border-destructive ib:aria-invalid:ring-3 ib:aria-invalid:ring-destructive/20 ib:md:text-sm ib:dark:aria-invalid:border-destructive/50 ib:dark:aria-invalid:ring-destructive/40',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
