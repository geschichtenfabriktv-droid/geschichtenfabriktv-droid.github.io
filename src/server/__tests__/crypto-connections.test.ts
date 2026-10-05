import { beforeEach, describe, expect, it } from "vitest";
import { consumeOAuthState, createOAuthState, deleteConnection, getTokens, listConnections, saveConnection } from "@/server/connections";
import { decrypt, encrypt, hashPassword, verifyPassword } from "@/server/crypto";
import { getDb, resetDbForTests } from "@/server/db";
import { createUser } from "@/server/users";

describe("Verschlüsselung", () => {
  it("hasht Passwörter und prüft sie", async () => {
    const h = await hashPassword("sehr-geheim-123");
    expect(h).not.toContain("sehr-geheim");
    expect(await verifyPassword("sehr-geheim-123", h)).toBe(true);
    expect(await verifyPassword("falsch", h)).toBe(false);
  });

  it("verschlüsselt mit AES-GCM und erkennt Manipulation", () => {
    const c = encrypt("token-abc");
    expect(c).not.toContain("token-abc");
    expect(encrypt("token-abc")).not.toBe(c);
    expect(decrypt(c)).toBe("token-abc");
    const parts = c.split(".");
    const ct = parts[3]!;
    parts[3] = ct.slice(0, -2) + (ct.endsWith("AA") ? "BB" : "AA");
    expect(() => decrypt(parts.join("."))).toThrow();
  });
});

describe("Marktplatz-Verbindungen", () => {
  beforeEach(() => resetDbForTests());

  it("speichert Tokens nur verschlüsselt und löscht sie beim Trennen", async () => {
    const user = await createUser(`v${Date.now()}@test.de`, "x", "Test");
    await saveConnection(user.id, "ebay", { accessToken: "AT-123", refreshToken: "RT-456" }, { accountLabel: "shop", consentAt: new Date() });
    const db = await getDb();
    const raw = await db.query<{ token_ciphertext: string }>("select token_ciphertext from connections where user_id = $1", [user.id]);
    expect(raw[0]!.token_ciphertext).not.toContain("AT-123");
    expect(await getTokens(user.id, "ebay")).toMatchObject({ accessToken: "AT-123", refreshToken: "RT-456" });
    expect((await listConnections(user.id))[0]).toMatchObject({ provider: "ebay", status: "verbunden" });
    expect(JSON.stringify(await listConnections(user.id))).not.toContain("AT-123");

    await deleteConnection(user.id, "ebay");
    expect(await getTokens(user.id, "ebay")).toBeNull();
  });

  it("OAuth-State ist einmalig und an den Anbieter gebunden", async () => {
    const user = await createUser(`s${Date.now()}@test.de`, "x", "Test");
    const state = await createOAuthState(user.id, "ebay");
    expect(await consumeOAuthState(state, "amazon")).toBeNull();
    expect(await consumeOAuthState(state, "ebay")).toBe(user.id);
    expect(await consumeOAuthState(state, "ebay")).toBeNull();
  });
});
