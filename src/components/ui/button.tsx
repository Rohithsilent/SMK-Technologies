import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[4px] font-medium transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-white text-[#00063D] hover:-translate-y-px hover:bg-[#FA4028] hover:text-white hover:shadow-[0_10px_26px_-4px_rgba(250,64,40,0.4)] light:bg-[#00063D] light:text-white light:hover:bg-[#FA4028] light:hover:text-white light:hover:shadow-[0_10px_26px_-4px_rgba(250,64,40,0.34)]",
        glass:
          "border border-indigo-200/30 bg-[#070D36]/65 text-[#F8FAFC] backdrop-blur-md hover:-translate-y-px hover:border-[#FA4028] hover:bg-[#FA4028]/14 hover:text-[#FF8573] light:border-[#00063D]/35 light:bg-white/85 light:text-[#00063D] light:hover:border-[#FA4028] light:hover:bg-[#FEDED0] light:hover:text-[#B82411]",
        ghost: "text-foreground hover:bg-foreground/[0.08]",
      },
      size: {
        default: "h-10 px-5 text-sm",
        sm: "h-9 px-4 text-xs",
        lg: "min-h-13 px-8 text-sm sm:px-10 sm:py-4 sm:text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
