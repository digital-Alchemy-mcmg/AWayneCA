import { describe, expect, it } from "vitest";

import { publicEnvSchema, serverEnvSchema } from "@/config/env";

describe("environment schema", () => {
  it("provides a local-only SQLite default", () => {
    expect(serverEnvSchema.parse({}).ASHANTE_SQLITE_PATH).toBe(".local/ashante.sqlite");
  });

  it("treats blank optional integration values as unset", () => {
    expect(serverEnvSchema.parse({ FIREBASE_PROJECT_ID: "" }).FIREBASE_PROJECT_ID).toBeUndefined();
    expect(
      publicEnvSchema.parse({ NEXT_PUBLIC_FIREBASE_PROJECT_ID: "" })
        .NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    ).toBeUndefined();
  });

  it("rejects a blank SQLite path", () => {
    expect(() => serverEnvSchema.parse({ ASHANTE_SQLITE_PATH: "" })).toThrow();
  });
});
