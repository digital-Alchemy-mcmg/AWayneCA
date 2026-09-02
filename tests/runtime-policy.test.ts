import { describe, expect, it } from "vitest";

import { assertLocalResearchRuntime, isLocalResearchRuntime } from "@/server/runtime-policy";

describe("authoritative SQLite runtime boundary", () => {
  it("allows a local Node runtime", () => {
    expect(isLocalResearchRuntime({})).toBe(true);
    expect(() => assertLocalResearchRuntime({})).not.toThrow();
  });

  it("blocks Vercel and Edge runtimes", () => {
    expect(isLocalResearchRuntime({ VERCEL: "1" })).toBe(false);
    expect(isLocalResearchRuntime({ NEXT_RUNTIME: "edge" })).toBe(false);
    expect(() => assertLocalResearchRuntime({ VERCEL: "1" })).toThrow(/local-only/);
  });
});
