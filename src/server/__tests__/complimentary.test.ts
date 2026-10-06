import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { resetDbForTests } from "@/server/db";
import { createUser, findUserById, hasAccess } from "@/server/users";

describe("Freigeschaltete Testzugänge", () => {
  beforeEach(() => resetDbForTests());
  afterEach(() => delete process.env.COMPLIMENTARY_EMAILS);

  it("gibt gelisteten Konten vollen Zugriff ohne Zahlung, anderen nicht", async () => {
    process.env.COMPLIMENTARY_EMAILS = " Team@Example.de , partner@example.de:starter";
    const team = await createUser("team@example.de", "x", "Team");
    const partner = await createUser("partner@example.de", "x", "Partner");
    const other = await createUser(`other${Date.now()}@example.de`, "x", "Andere");
    const t = (await findUserById(team.id))!;
    expect(t.plan).toBe("business");
    expect(hasAccess(t)).toBe(true);
    expect((await findUserById(partner.id))!.plan).toBe("starter");
    expect(hasAccess((await findUserById(other.id))!)).toBe(false);
  });
});
