import { Header } from "@/components/layout/Header";
import { WikipediaAudit } from "@/components/wikipedia/WikipediaAudit";

export default function WikipediaCorporatePage() {
  return (
    <>
      <Header
        title="Wikipedia Analytics · Corporate"
        subtitle="BeOne Medicines — traffic, maintenance flags & editorial review"
      />
      <WikipediaAudit articleUrl="https://en.wikipedia.org/wiki/BeOne_Medicines" />
    </>
  );
}
