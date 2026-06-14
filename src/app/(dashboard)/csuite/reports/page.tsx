import { ExecutiveReports } from "@/components/csuite/ExecutiveReports";
import { CsuitePageShell } from "@/components/csuite/CsuitePageShell";
import { CSUITE_PRODUCT_NAME } from "@/lib/csuite/content";

export default function CsuiteReportsPage() {
  return (
    <CsuitePageShell
      title="Performance Reports"
      subtitle={`${CSUITE_PRODUCT_NAME} · Monthly & quarterly executive analytics`}
    >
      <ExecutiveReports />
    </CsuitePageShell>
  );
}
