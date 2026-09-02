import "server-only";

import { assertLocalResearchRuntime } from "@/server/runtime-policy";

/** Call before opening the authoritative desktop SQLite corpus. */
export function requireSQLiteRuntime(): void {
  assertLocalResearchRuntime();
}
