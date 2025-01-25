import ErrorComponent from "@/components/ErrorComponent";

export default function TestError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <ErrorComponent error={error} reset={reset} />;
}
