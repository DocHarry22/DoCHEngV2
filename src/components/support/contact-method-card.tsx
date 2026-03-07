import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ContactMethod } from "@/lib/support-content";

type ContactMethodCardProps = {
  method: ContactMethod;
};

export function ContactMethodCard({ method }: ContactMethodCardProps) {
  return (
    <Card className="h-full space-y-4 bg-[var(--surface-0)]">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">{method.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-subtle)]">{method.summary}</p>
      </div>

      <div className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4 text-sm">
        <p>
          <span className="font-semibold text-[var(--text-main)]">Channel:</span> {method.channel}
        </p>
        <p>
          <span className="font-semibold text-[var(--text-main)]">Response:</span> {method.responseWindow}
        </p>
        <p>
          <span className="font-semibold text-[var(--text-main)]">Best for:</span> {method.bestFor}
        </p>
      </div>

      <Button href={method.ctaHref} className="w-full sm:w-auto">
        {method.ctaLabel}
      </Button>
    </Card>
  );
}
