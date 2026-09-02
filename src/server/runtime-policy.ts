export interface RuntimeSignals {
  [key: string]: string | undefined;
  NEXT_RUNTIME?: string;
  VERCEL?: string;
}

export function isLocalResearchRuntime(environment: RuntimeSignals): boolean {
  return environment.VERCEL !== "1" && environment.NEXT_RUNTIME !== "edge";
}

export function assertLocalResearchRuntime(environment: RuntimeSignals = process.env): void {
  if (!isLocalResearchRuntime(environment)) {
    throw new Error(
      "Ashante's authoritative SQLite research corpus is local-only and cannot run in a browser, Edge runtime, or Vercel deployment.",
    );
  }
}
