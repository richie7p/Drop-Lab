import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 pressable",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-fg hover:bg-accent/90",
        secondary: "bg-surface-2 text-fg shadow-border hover:bg-surface-2/80",
        ghost: "text-muted hover:bg-surface-2 hover:text-fg",
        danger: "bg-danger text-fg hover:opacity-90",
      },
      size: {
        default: "h-11 rounded-lg px-4",
        sm: "h-9 rounded-md px-3 text-xs",
        icon: "size-11 rounded-lg",
      },
      active: {
        true: "bg-accent text-accent-fg hover:bg-accent/90",
        false: "",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "default",
    },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  active,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, active }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
