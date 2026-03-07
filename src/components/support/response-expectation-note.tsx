import { Card } from "@/components/ui/card";
import type { SupportResponseNote } from "@/lib/support-content";

type ResponseExpectationNoteProps = {
  note: SupportResponseNote;
};

export function ResponseExpectationNote({ note }: ResponseExpectationNoteProps) {
  return (
    <Card className="space-y-2 bg-[var(--surface-0)]">
      <h3 className="text-base font-semibold tracking-tight">{note.title}</h3>
      <p className="text-sm leading-relaxed text-[var(--text-subtle)]">{note.body}</p>
    </Card>
  );
}
