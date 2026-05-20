import { SessionRunner } from "./SessionRunner";

export default function SessionPage({
  searchParams,
}: {
  searchParams: { topic?: string; mode?: string; vault?: string };
}) {
  return (
    <SessionRunner
      topicId={searchParams.topic ?? null}
      mode={(searchParams.mode as "mix" | "errors" | "vault" | "topic") ?? "mix"}
      vaultSlug={searchParams.vault ?? null}
    />
  );
}
