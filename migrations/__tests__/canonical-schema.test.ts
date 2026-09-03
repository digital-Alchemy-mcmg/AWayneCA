import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { SQLITE_TABLE_MANIFEST } from "../../src/domain/property-envelope";

const migration = readFileSync(
  new URL("../0001_canonical_research_schema.sql", import.meta.url),
  "utf8",
);

const contractDerivedTables = [
  "_schema_meta",
  "property_characteristics",
  "property_envelopes",
] as const;

let database: DatabaseSync;

function tableNames(): string[] {
  return database
    .prepare(
      `SELECT name
       FROM sqlite_master
       WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
       ORDER BY name`,
    )
    .all()
    .map((row) => String(row.name));
}

function insertIdentity(propertyId = "ash_prop_001", parcel = "001230045600"): void {
  database
    .prepare(
      `INSERT INTO property_identity (
         property_id, parcel_id_normalized, municipality, match_status,
         match_confidence, identity_json, created_at, updated_at
       ) VALUES (?, ?, 'Detroit', 'verified', 'HIGH', '{}', ?, ?)`,
    )
    .run(propertyId, parcel, "2026-09-03T00:00:00Z", "2026-09-03T00:00:00Z");
}

function insertSource(): void {
  database
    .prepare(
      `INSERT INTO source_registry (
         source_id, display_name, authority_rank, access_mode,
         schema_contract_version, operational_status, config_json
       ) VALUES ('DS_TEST', 'Synthetic Test Source', 'official_government',
                 'permitted_snapshot', 'test-v1', 'AVAILABLE', '{}')`,
    )
    .run();
}

beforeEach(() => {
  database = new DatabaseSync(":memory:");
  database.exec(migration);
});

afterEach(() => {
  database.close();
});

describe("0001 canonical research schema", () => {
  it("creates every manifest table plus exactly three justified projections", () => {
    const expected = [...SQLITE_TABLE_MANIFEST, ...contractDerivedTables].sort();

    expect(tableNames()).toEqual(expected);
    expect(tableNames()).toHaveLength(49);
  });

  it("creates all domain tables in strict mode with valid foreign keys", () => {
    const tables = database.prepare("PRAGMA table_list").all();
    const projectTables = tables.filter(
      (row) => row.schema === "main" && !String(row.name).startsWith("sqlite_"),
    );

    expect(projectTables).toHaveLength(49);
    expect(projectTables.every((row) => row.strict === 1)).toBe(true);
    expect(database.prepare("PRAGMA foreign_key_check").all()).toEqual([]);
  });

  it("preserves parcel identities as text, including leading zeroes", () => {
    insertIdentity();

    const row = database
      .prepare(
        "SELECT property_id, parcel_id_normalized FROM property_identity WHERE property_id = ?",
      )
      .get("ash_prop_001");

    expect(row).toEqual({
      property_id: "ash_prop_001",
      parcel_id_normalized: "001230045600",
    });
  });

  it("rejects duplicate strong parcel identity within a municipality", () => {
    insertIdentity();

    expect(() => insertIdentity("ash_prop_002")).toThrow(/UNIQUE constraint failed/);
  });

  it("retains a complete canonical envelope snapshot without redefining it", () => {
    insertIdentity();
    const envelope = {
      schema_version: "1.0.0",
      property_id: "ash_prop_001",
      identity: { parcel_id_normalized: "001230045600" },
    };

    database
      .prepare(
        `INSERT INTO property_envelopes (
           property_id, schema_version, envelope_timestamp, decision_state,
           ingestion_state, envelope_json, created_at, updated_at
         ) VALUES (?, '1.0.0', ?, 'RESEARCH', 'NORMALIZED', ?, ?, ?)`,
      )
      .run(
        "ash_prop_001",
        "2026-09-03T00:00:00Z",
        JSON.stringify(envelope),
        "2026-09-03T00:00:00Z",
        "2026-09-03T00:00:00Z",
      );

    const row = database
      .prepare("SELECT envelope_json FROM property_envelopes WHERE property_id = ?")
      .get("ash_prop_001");
    expect(JSON.parse(String(row?.envelope_json))).toEqual(envelope);
  });

  it("keeps evidence immutable and source-linked", () => {
    insertIdentity();
    insertSource();
    database
      .prepare(
        `INSERT INTO evidence_ledger (
           evidence_id, entity_type, entity_id, property_id, field_path,
           value_json, source_id, method, captured_at, confidence,
           epistemic_state, review_state
         ) VALUES ('ev_001', 'property', 'ash_prop_001', 'ash_prop_001',
                   'identity.parcel_id_normalized', '"001230045600"', 'DS_TEST',
                   'permitted_snapshot', '2026-09-03T00:00:00Z', 'HIGH',
                   'FACT', 'validated')`,
      )
      .run();

    expect(() =>
      database.prepare("UPDATE evidence_ledger SET confidence = 'LOW'").run(),
    ).toThrow(/append-only/);
    expect(() => database.prepare("DELETE FROM evidence_ledger").run()).toThrow(
      /append-only/,
    );
  });

  it("preserves recommendation, promotion, and audit histories as append-only", () => {
    insertIdentity();
    database.exec(`
      INSERT INTO strategies
        (strategy_id, property_id, strategy_type, calculated_at, strategy_json)
      VALUES ('str_001', 'ash_prop_001', 'hold', '2026-09-03T00:00:00Z', '{}');
      INSERT INTO bid_plans
        (bid_plan_id, property_id, target_bid, hard_max_bid, calculated_at, plan_json)
      VALUES ('bid_001', 'ash_prop_001', 10000, 12000, '2026-09-03T00:00:00Z', '{}');
      INSERT INTO recommendations
        (recommendation_id, property_id, strategy_id, bid_plan_id, model_version,
         decision_state, calculated_at, recommendation_json)
      VALUES ('rec_001', 'ash_prop_001', 'str_001', 'bid_001', 'test-v1',
              'RESEARCH', '2026-09-03T00:00:00Z', '{}');
      INSERT INTO recommendation_versions
        (recommendation_version_id, recommendation_id, version, snapshot_json, created_at)
      VALUES ('recv_001', 'rec_001', 1, '{}', '2026-09-03T00:00:00Z');
      INSERT INTO promotion_snapshots
        (promotion_id, property_id, schema_version, envelope_json, promoted_at,
         promoted_by, status, warnings_json, blocking_gates_json)
      VALUES ('prom_001', 'ash_prop_001', '1.0.0', '{}', '2026-09-03T00:00:00Z',
              'operator', 'promoted', '[]', '[]');
      INSERT INTO audit_log
        (log_id, event_type, entity_type, entity_id, actor, detail_json, occurred_at)
      VALUES ('log_001', 'promotion', 'property', 'ash_prop_001', 'operator', '{}',
              '2026-09-03T00:00:00Z');
    `);

    for (const table of [
      "recommendation_versions",
      "promotion_snapshots",
      "audit_log",
    ]) {
      expect(() => database.prepare(`DELETE FROM ${table}`).run()).toThrow(/append-only/);
    }
  });

  it("enforces conservative bid and imagery constraints", () => {
    insertIdentity();

    expect(() =>
      database
        .prepare(
          `INSERT INTO bid_plans
             (bid_plan_id, property_id, target_bid, hard_max_bid, calculated_at, plan_json)
           VALUES ('bid_bad', 'ash_prop_001', 15000, 12000, ?, '{}')`,
        )
        .run("2026-09-03T00:00:00Z"),
    ).toThrow(/CHECK constraint failed/);

    expect(() =>
      database
        .prepare(
          `INSERT INTO imagery_observations
             (observation_id, property_id, observation_type, confidence,
              captured_at, observation_json)
           VALUES ('img_bad', 'ash_prop_001', 'street_imagery_triage', 'HIGH', ?, '{}')`,
        )
        .run("2026-09-03T00:00:00Z"),
    ).toThrow(/CHECK constraint failed/);
  });

  it("forbids manufactured title-clearance labels", () => {
    insertIdentity();

    expect(() =>
      database
        .prepare(
          `INSERT INTO title_research_cases
             (title_case_id, property_id, title_status, updated_at, case_json)
           VALUES ('title_bad', 'ash_prop_001', 'clear', ?, '{}')`,
        )
        .run("2026-09-03T00:00:00Z"),
    ).toThrow(/CHECK constraint failed/);
  });
});
