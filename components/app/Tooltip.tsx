'use client';

import { useState, useRef, ReactNode } from "react"

import {
  useFloating,
  offset,
  flip,
  shift,
  arrow,
  autoUpdate,
  Placement,
  FloatingArrow,
} from "@floating-ui/react"

interface TooltipProps {
  children: ReactNode
  message: ReactNode
  placement?: Placement
}

export const Tooltip = ({ children, message, placement = "top" }: TooltipProps) => {
  const [open, setOpen] = useState(false)
  const arrowRef = useRef(null)

  const { refs, floatingStyles, context } = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    middleware: [
      offset(10),
      flip({ padding: 5 }),
      shift({ padding: 5 }),
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: autoUpdate,
  })

  return (
    <div
      ref={refs.setReference}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="inline-block w-max"
    >
      {children}
      {open && (
        <div
          ref={refs.setFloating}
          className="bg-background text-foreground text-sm px-2 py-1 border border-primary rounded-md shadow-sm w-fit"
          style={{
            ...floatingStyles,
            zIndex: 1000,
            pointerEvents: "none",
          }}
        >
          {message}
          <FloatingArrow
            ref={arrowRef}
            context={context}
            className="fill-primary"
            width={14}
            height={7}
          />
        </div>
      )}
    </div>
  )
}
