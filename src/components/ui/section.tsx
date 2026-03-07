import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/container";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
};

export function Section({ id, children, className, containerClassName }: SectionProps) {
  return (
    <section id={id} className={cn("py-16 sm:py-20", className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
