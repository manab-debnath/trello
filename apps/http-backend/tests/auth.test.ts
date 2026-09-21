import { beforeAll, afterAll, describe, expect, it, vi } from "vitest";

vi.mock("queue/email-queue", () => ({
  emailQueue: {
    add: vi.fn().mockResolvedValue({}),
  },
}));

import { auth } from "../config/auth";
import { prisma } from "db/client";
import { fromNodeHeaders } from "better-auth/node";

// -----------------------------------------------------------------------------
// Test configuration
// -----------------------------------------------------------------------------

const TEST_USER = {
  name: "Test User",
  email: `test-${Date.now()}@example.com`,
  password: "TestPassword123!",
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function createHeaders(cookie?: string) {
  return new Headers(
    cookie
      ? {
          cookie,
        }
      : undefined,
  );
}

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe("Authentication", () => {
  let sessionCookie: string | undefined;

  beforeAll(async () => {
    // Make sure the test database is reachable.
    await prisma.$connect();
  });

  afterAll(async () => {
    // Remove test data.
    await prisma.user.deleteMany({
      where: {
        email: TEST_USER.email,
      },
    });

    await prisma.$disconnect();
  });

  // ---------------------------------------------------------------------------
  // Sign up
  // ---------------------------------------------------------------------------

  it("should create a new user", async () => {
    const response = await auth.api.signUpEmail({
      body: {
        name: TEST_USER.name,
        email: TEST_USER.email,
        password: TEST_USER.password,
      },
    });

    expect(response).toBeDefined();
    expect(response.user).toBeDefined();

    expect(response.user.email).toBe(TEST_USER.email);
    expect(response.user.name).toBe(TEST_USER.name);
  });

  it("should not allow duplicate email registration", async () => {
    await expect(
      auth.api.signUpEmail({
        body: {
          name: "Another User",
          email: TEST_USER.email,
          password: TEST_USER.password,
        },
      }),
    ).rejects.toThrow();
  });

  // ---------------------------------------------------------------------------
  // Sign in
  // ---------------------------------------------------------------------------

  it("should reject sign in when email is not verified", async () => {
    await expect(
      auth.api.signInEmail({
        body: {
          email: TEST_USER.email,
          password: TEST_USER.password,
        },
      }),
    ).rejects.toThrow();
  });

  it("should reject sign in with an incorrect password", async () => {
    await expect(
      auth.api.signInEmail({
        body: {
          email: TEST_USER.email,
          password: "WrongPassword123!",
        },
      }),
    ).rejects.toThrow();
  });

  // ---------------------------------------------------------------------------
  // Session
  // ---------------------------------------------------------------------------

  it("should return no session without authentication", async () => {
    const session = await auth.api.getSession({
      headers: new Headers(),
    });

    expect(session).toBeNull();
  });

  // ---------------------------------------------------------------------------
  // Password reset
  // ---------------------------------------------------------------------------

  it("should accept a password reset request for an existing user", async () => {
    const response = await auth.api.requestPasswordReset({
      body: {
        email: TEST_USER.email,
        redirectTo: "http://localhost:3000/reset-password",
      },
    });

    expect(response).toBeDefined();
  });

  it("should handle password reset request for an unknown email", async () => {
    const response = await auth.api.requestPasswordReset({
      body: {
        email: "does-not-exist@example.com",
        redirectTo: "http://localhost:3000/reset-password",
      },
    });

    expect(response).toBeDefined();
  });
});
