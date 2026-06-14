import { WebsiteAuditTool } from "@/components/website-seo/WebsiteAuditTool";
import { WebsiteSeoPageShell } from "@/components/website-seo/WebsiteSeoPageShell";
import { WEBSITE_SEO_PRODUCT_NAME } from "@/lib/website-seo/content";

export default function WebsiteSeoAuditPage() {
  return (
    <WebsiteSeoPageShell
      title="Run SEO Audit"
      subtitle={`${WEBSITE_SEO_PRODUCT_NAME} · Scan any website on demand`}
    >
      <WebsiteAuditTool />
    </WebsiteSeoPageShell>
  );
}
