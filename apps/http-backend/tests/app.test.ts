import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

describe("GET /api/v1/health", () => {
  it("should return 200 OK and status object", async () => {
    // Act: Send a simulated HTTP request via Supertest
    const response = await request(app).get("/api/v1/health");

    // Assert: Check response properties using Vitest's Jest-compatible matchers
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      dynamic: true,
    });
  });
});
