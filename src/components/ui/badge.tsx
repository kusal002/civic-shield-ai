import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold tracking-wide",
  {
    variants: {
      tone: {
        neutral: "bg-[#edf3f1] text-[#52645e]",
        safe: "bg-brand-soft text-brand-strong",
        caution: "bg-[#fff1d6] text-[#8a550e]",
        urgent: "bg-[#ffe4df] text-[#9b3028]",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

function Badge({ className, tone, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export { Badge, badgeVariants };
