import { beforeAll, afterAll, describe, expect, it, vi } from "vitest";

describe("User", () => {
  it("should change user information", async () => {
    const { userId, cookies } = await createAuthenticatedUser();

    // test changeUserInfo
  });

  it("should change email", async () => {
    const { userId, cookies } = await createAuthenticatedUser();

    // test changeEmail
  });

  it("should delete account", async () => {
    const { userId, cookies } = await createAuthenticatedUser();

    // test deleteAccount
  });
});
