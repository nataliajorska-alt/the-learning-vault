import { SessionRunner } from "./SessionRunner";

export default function SessionPage({
  searchParams,
}: {
  searchParams: { topic?: string; mode?: string; vault?: string; limit?: string };
}) {
  const parsedLimit = searchParams.limit
    ? Number.parseInt(searchParams.limit, 10)
    : null;
  const questionLimit =
    parsedLimit && Number.isFinite(parsedLimit) && parsedLimit > 0
      ? parsedLimit
      : null;
  return (
    <SessionRunner
      topicId={searchParams.topic ?? null}
      mode={(searchParams.mode as "mix" | "errors" | "vault" | "topic") ?? "mix"}
      vaultSlug={searchParams.vault ?? null}
      questionLimit={Number.isFinite(questionLimit) ? questionLimit : null}
    />
  );
}
