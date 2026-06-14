import { ContentGenerator } from "@/components/csuite/ContentGenerator";
import { CsuitePageShell } from "@/components/csuite/CsuitePageShell";
import { CSUITE_PRODUCT_NAME } from "@/lib/csuite/content";

export default function CsuiteGeneratePage() {
  return (
    <CsuitePageShell
      title="Generate Content"
      subtitle={`${CSUITE_PRODUCT_NAME} · Corporate signal to executive voice`}
    >
      <ContentGenerator />
    </CsuitePageShell>
  );
}
