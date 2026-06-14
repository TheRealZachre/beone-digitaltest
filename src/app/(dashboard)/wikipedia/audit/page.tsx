import { WikipediaAuditTool } from "@/components/wikipedia/WikipediaAuditTool";
import { WikipediaPageShell } from "@/components/wikipedia/WikipediaPageShell";
import { WIKIPEDIA_PRODUCT_NAME } from "@/lib/wikipedia/content";

export default function WikipediaAuditPage() {
  return (
    <WikipediaPageShell
      title="Run Wikipedia Audit"
      subtitle={`${WIKIPEDIA_PRODUCT_NAME} · Company & CEO page analysis`}
    >
      <WikipediaAuditTool />
    </WikipediaPageShell>
  );
}
