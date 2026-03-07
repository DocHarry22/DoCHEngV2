import { Button, type ButtonVariant } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export type CTAAction = {
  label: string;
  href: string;
  variant?: ButtonVariant;
};

type DownloadCTAGroupProps = {
  actions: CTAAction[];
  className?: string;
  buttonClassName?: string;
};

export function DownloadCTAGroup({ actions, className, buttonClassName }: DownloadCTAGroupProps) {
  if (!actions.length) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {actions.map((action) => (
        <Button key={`${action.label}-${action.href}`} href={action.href} variant={action.variant ?? "primary"} className={cn("px-4 py-2 text-xs", buttonClassName)}>
          {action.label}
        </Button>
      ))}
    </div>
  );
}
