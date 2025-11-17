'use client';

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer",
  {
    variants: {
      variant: {
        ghost: "hover:bg-accent/10 text-foreground hover:text-accent",
        outline: "border-[0.05rem] bg-transparent hover:border-accent hover:text-accent",
        solid: "bg-accent text-white hover:bg-accent/90",
      },
      size: {
        default: "h-9 w-9",
        sm: "h-8 w-8",
        lg: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "default",
    },
  }
);

interface IconButtonProps extends VariantProps<typeof iconButtonVariants> {
  icon: React.ReactNode;
  ariaLabel: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  bgColor?: string;
  disabled?: boolean;
  props?: any;
}

export const IconButton = ({
  icon,
  ariaLabel,
  onClick,
  className,
  variant = 'ghost',
  size,
  bgColor,
  disabled = false,
  props,
}: IconButtonProps) => {

  return (
    <button
      className={cn(iconButtonVariants({ variant, size, className }))}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      {...props}
    >
      {icon}
    </button>
  );
};
