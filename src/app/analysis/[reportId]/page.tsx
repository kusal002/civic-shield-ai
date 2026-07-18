import { AnalysisWorkspace } from "@/components/analysis/analysis-workspace";

export default async function AnalysisPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  return <AnalysisWorkspace reportId={reportId} />;
}
