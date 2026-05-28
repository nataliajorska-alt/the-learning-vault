"use client";

import { TopicEditor } from "./TopicEditor";

export default function TopicEditPage({
  params,
}: {
  params: { slug: string; topicId: string };
}) {
  return <TopicEditor slug={params.slug} topicId={params.topicId} />;
}
