import { SalonDetail } from "./SalonDetail";

export default function SalonDetailPage({
  params,
}: {
  params: { topicId: string };
}) {
  return <SalonDetail topicId={params.topicId} />;
}
