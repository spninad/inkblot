import { cn } from 'cn';

function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        'ib:pointer-events-none ib:inline-flex ib:h-5.5 ib:w-fit ib:min-w-5.5 ib:items-center ib:justify-center ib:gap-1 ib:rounded-lg ib:bg-muted ib:px-1.5 ib:font-sans ib:text-xs ib:font-medium ib:text-muted-foreground ib:select-none ib:in-data-[slot=input-group]:bg-input ib:in-data-[slot=tooltip-content]:bg-background/20 ib:in-data-[slot=tooltip-content]:text-background ib:dark:in-data-[slot=tooltip-content]:bg-background/10 ib:[&_svg:not([class*=size-])]:size-3',
        className,
      )}
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn('ib:inline-flex ib:items-center ib:gap-1', className)}
      {...props}
    />
  );
}

export { Kbd, KbdGroup };
