'use client';

import { Tooltip } from "../Tooltip"
import React from "react"

interface IconButtonProps {
  icon: React.ReactNode
  ariaLabel: string
  onClick?: () => void
  href?: string
  className?: string
  disabled?: boolean
  props?: any
  variant?: "ghost" | "outline" | "danger" | "solid"
  size?: "sm" | "md" | "lg"
}

export const TooltipIconButton = ({
  icon,
  ariaLabel,
  onClick,
  href,
  className,
  disabled = false,
  props,
  variant = "ghost",
  size = "md",
}: IconButtonProps) => {
  const variants = {
    ghost: "bg-transparent text-foreground outline-none hover:text-secondary",
    outline:
      "bg-transparent text-foreground border-border border hover:text-foreground hover:border-foreground rounded-md p-2 transition-border duration-300 ease-in-out",
    danger: "bg-transparent text-red-500 border-red-500 border hover:text-red-800 hover:border-red-800 rounded-md p-2 transition-border duration-300 ease-in-out",
    solid: "bg-foreground text-border border-border border hover:bg-foreground hover:text-white hover:border-border rounded-md p-2 transition-all duration-300 ease-in-out",
  }

  const sizes = {
    sm: "w-8 h-8 rounded-sm",
    md: "w-10 h-10 rounded-md",
    lg: "w-12 h-12",
  }

  // Общие пропсы для обоих вариантов
  const commonProps = {
    className: `${variants[variant]} ${sizes[size]} items-center justify-center flex cursor-pointer ${className || ""}`,
    "aria-label": ariaLabel,
    type: "button",
    disabled,
    ...props,
  }

  return (
    <Tooltip message={ariaLabel}>
      {href ? (
        <a href={href} {...commonProps}>
          {icon}
        </a>
      ) : (
        <button {...commonProps} onMouseDown={onClick}>
          {icon}
        </button>
      )}
    </Tooltip>
  )
}
