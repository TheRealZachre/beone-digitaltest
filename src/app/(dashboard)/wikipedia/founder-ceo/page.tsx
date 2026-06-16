import { Header } from "@/components/layout/Header";
import { WikipediaAudit } from "@/components/wikipedia/WikipediaAudit";

export default function WikipediaFounderPage() {
  return (
    <>
      <Header
        title="Wikipedia Analytics · Founder & CEO"
        subtitle="John V. Oyler — traffic, maintenance flags & editorial review"
      />
      <WikipediaAudit articleUrl="https://en.wikipedia.org/wiki/John_V._Oyler" />
    </>
  );
}
