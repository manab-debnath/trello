import { beforeAll, afterAll, describe, expect, it, vi } from "vitest";
import request from "supertest";
import crypto from "node:crypto";

vi.mock("queue/email-queue", () => ({
  emailQueue: {
    add: vi.fn().mockResolvedValue({}),
  },
}));

import app, { redis } from "../app";
import { prisma } from "db/client";
import { test } from "../config/test-setup";

const createdUserIds: string[] = [];
const createdOrgIds: string[] = [];

async function createAuthenticatedUser(overrides?: {
  name?: string;
  email?: string;
}) {
  const user = test.createUser(overrides);
  const savedUser = await test.saveUser(user);
  createdUserIds.push(savedUser.id);

  const loginRes = await test.login({ userId: savedUser.id });
  const cookies = loginRes.headers.get("cookie") || "";

  return {
    user: savedUser,
    userId: savedUser.id,
    cookies,
    headers: loginRes.headers,
    session: loginRes.session,
  };
}

describe("User Integration Tests", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    if (createdOrgIds.length > 0) {
      await prisma.organization.deleteMany({
        where: { id: { in: createdOrgIds } },
      });
    }

    if (createdUserIds.length > 0) {
      await prisma.user.deleteMany({
        where: { id: { in: createdUserIds } },
      });
    }

    await prisma.$disconnect();
  });

  describe("GET /api/v1/users/profile", () => {
    it("should return the authenticated user profile", async () => {
      const { user, cookies } = await createAuthenticatedUser();

      const response = await request(app)
        .get("/api/v1/users/profile")
        .set("Cookie", cookies);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(user.id);
      expect(response.body.email).toBe(user.email);
      expect(response.body.name).toBe(user.name);
    });

    it("should reject unauthenticated request with 401", async () => {
      const response = await request(app).get("/api/v1/users/profile");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthenticated");
    });
  });

  describe("PATCH /api/v1/users/profile", () => {
    it("should change user information", async () => {
      const { userId, cookies } = await createAuthenticatedUser({
        name: "Initial Name",
      });

      const response = await request(app)
        .patch("/api/v1/users/profile")
        .set("Cookie", cookies)
        .send({ name: "Updated Name" });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Updated Name");

      const updatedUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      expect(updatedUser?.name).toBe("Updated Name");
    });

    it("should fail when name is not provided", async () => {
      const { cookies } = await createAuthenticatedUser();

      const response = await request(app)
        .patch("/api/v1/users/profile")
        .set("Cookie", cookies)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Name is required");
    });

    it("should fail when new name is identical to current name", async () => {
      const currentName = "Same Name";
      const { cookies } = await createAuthenticatedUser({ name: currentName });

      const response = await request(app)
        .patch("/api/v1/users/profile")
        .set("Cookie", cookies)
        .send({ name: currentName });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Name is the same as the current name",
      );
    });

    it("should reject unauthenticated request with 401", async () => {
      const response = await request(app)
        .patch("/api/v1/users/profile")
        .send({ name: "Any Name" });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthenticated");
    });
  });

  describe("PATCH /api/v1/users/change-email", () => {
    it("should change email", async () => {
      const { cookies } = await createAuthenticatedUser();
      const newEmail = `updated-${Date.now()}@example.com`;

      const response = await request(app)
        .patch("/api/v1/users/change-email")
        .set("Cookie", cookies)
        .send({ email: newEmail });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Verification link sent");
    });

    it("should fail when email is not provided", async () => {
      const { cookies } = await createAuthenticatedUser();

      const response = await request(app)
        .patch("/api/v1/users/change-email")
        .set("Cookie", cookies)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Email is required");
    });

    it("should reject unauthenticated request with 401", async () => {
      const response = await request(app)
        .patch("/api/v1/users/change-email")
        .send({ email: "test@example.com" });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthenticated");
    });
  });

  describe("DELETE /api/v1/users/profile", () => {
    it("should delete account", async () => {
      const { userId, cookies } = await createAuthenticatedUser();

      const response = await request(app)
        .delete("/api/v1/users/profile")
        .set("Cookie", cookies);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Account deleted");

      const deletedUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      expect(deletedUser).toBeNull();
    });

    it("should reject unauthenticated request with 401", async () => {
      const response = await request(app).delete("/api/v1/users/profile");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthenticated");
    });
  });

  describe("POST /api/v1/users/sign-out", () => {
    it("should sign out successfully and invalidate session", async () => {
      const { cookies } = await createAuthenticatedUser();

      const response = await request(app)
        .post("/api/v1/users/sign-out")
        .set("Cookie", cookies);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Signed out successfully");

      const profileResponse = await request(app)
        .get("/api/v1/users/profile")
        .set("Cookie", cookies);

      expect(profileResponse.status).toBe(401);
    });

    it("should reject unauthenticated sign out with 401", async () => {
      const response = await request(app).post("/api/v1/users/sign-out");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthenticated");
    });
  });

  describe("Password routes", () => {
    it("should trigger forgot password for authenticated user", async () => {
      const { cookies } = await createAuthenticatedUser();

      const response = await request(app)
        .post("/api/v1/users/forgot-password")
        .set("Cookie", cookies);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "If the email exists, a reset link has been sent",
      );
    });

    it("should reject reset password when token or new password is missing", async () => {
      const response = await request(app)
        .post("/api/v1/users/reset-password")
        .send({ token: "some-token" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Token and new password are required",
      );
    });
  });

  describe("Organization Invitations", () => {
    it("should reject accept invitation with invalid or expired token", async () => {
      const { cookies } = await createAuthenticatedUser();

      const response = await request(app)
        .post("/api/v1/users/accept-invitation/non-existent-token")
        .set("Cookie", cookies);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid or expired token");
    });

    it("should reject accept invitation if token belongs to a different email", async () => {
      const { cookies } = await createAuthenticatedUser();
      const token = crypto.randomBytes(16).toString("hex");

      await redis.set(
        `invitation:${token}`,
        JSON.stringify({
          email: "another-user@example.com",
          organizationID: "dummy-org-id",
          createdAT: new Date().toISOString(),
        }),
        "EX",
        60,
      );

      const response = await request(app)
        .post(`/api/v1/users/accept-invitation/${token}`)
        .set("Cookie", cookies);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("User does not match");

      await redis.del(`invitation:${token}`);
    });

    it("should accept invitation successfully for pending member", async () => {
      const { user, cookies } = await createAuthenticatedUser();
      const token = crypto.randomBytes(16).toString("hex");

      const org = await prisma.organization.create({
        data: {
          name: "Test Org for Acceptance",
          description: "Testing invitation acceptance",
        },
      });
      createdOrgIds.push(org.id);

      await prisma.pendingMember.create({
        data: {
          email: user.email,
          organizationID: org.id,
        },
      });

      await redis.set(
        `invitation:${token}`,
        JSON.stringify({
          email: user.email,
          organizationID: org.id,
          createdAT: new Date().toISOString(),
        }),
        "EX",
        60,
      );

      const response = await request(app)
        .post(`/api/v1/users/accept-invitation/${token}`)
        .set("Cookie", cookies);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Invitation accepted successfully");

      const orgUser = await prisma.organizationUser.findUnique({
        where: {
          userID_organizationID: {
            userID: user.id,
            organizationID: org.id,
          },
        },
      });
      expect(orgUser).not.toBeNull();
      expect(orgUser?.accepted).toBe(true);

      const remainingPending = await prisma.pendingMember.findUnique({
        where: {
          email: user.email,
          organizationID: org.id,
        },
      });
      expect(remainingPending).toBeNull();

      const redisToken = await redis.get(`invitation:${token}`);
      expect(redisToken).toBeNull();
    });

    it("should reject invitation successfully", async () => {
      const { user, cookies } = await createAuthenticatedUser();
      const token = crypto.randomBytes(16).toString("hex");

      const org = await prisma.organization.create({
        data: {
          name: "Test Org for Rejection",
          description: "Testing invitation rejection",
        },
      });
      createdOrgIds.push(org.id);

      await prisma.pendingMember.create({
        data: {
          email: user.email,
          organizationID: org.id,
        },
      });

      await redis.set(
        `invitation:${token}`,
        JSON.stringify({
          email: user.email,
          organizationID: org.id,
          createdAT: new Date().toISOString(),
        }),
        "EX",
        60,
      );

      const response = await request(app)
        .delete(`/api/v1/users/reject-invitation/${token}`)
        .set("Cookie", cookies);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Invitation rejected successfully");

      const pendingMember = await prisma.pendingMember.findUnique({
        where: {
          email: user.email,
          organizationID: org.id,
        },
      });
      expect(pendingMember).toBeNull();

      const redisToken = await redis.get(`invitation:${token}`);
      expect(redisToken).toBeNull();
    });
  });
});
