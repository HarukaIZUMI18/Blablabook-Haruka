import { describe, test, expect, vi, beforeEach } from "vitest";

// Chaque factory vi.mock() est totalement autonome — aucune variable extérieure
// Vitest peut les hisser sans risque de référence avant initialisation
vi.mock("../models/index.js", () => ({
  User: { findByPk: vi.fn(), findOne: vi.fn() },
  Book: {},
  Collect: {},
  sequelize: {},
}));

vi.mock("argon2", () => ({
  default: { hash: vi.fn(), verify: vi.fn() },
}));

import app from "../index.js";
import request from "supertest";
import jwt from "jsonwebtoken";

// On récupère les mocks APRÈS les imports pour pouvoir les configurer dans les tests
import { User } from "../models/index.js";
import argon2 from "argon2";

beforeEach(() => vi.clearAllMocks());

process.env.JWT_SECRET = "test_secret";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const TOKEN = jwt.sign({ userId: 1 }, "test_secret");
const AUTH = { Authorization: `Bearer ${TOKEN}` };

const FAKE_USER_PUBLIC = { id: 1, email: "test@example.com", name: "TestUser" };

const FAKE_USER = {
  id: 1,
  email: "test@example.com",
  name: "TestUser",
  password: "hashed",
  save: vi.fn(),
  destroy: vi.fn(),
};

// ── GET /user ─────────────────────────────────────────────────────────────────

describe("GET /user", () => {
  test("200 – retourne le profil sans mot de passe", async () => {
    User.findByPk.mockResolvedValue(FAKE_USER_PUBLIC);

    const res = await request(app).get("/user/me").set(AUTH);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: 1,
      email: "test@example.com",
      name: "TestUser",
    });
    expect(res.body).not.toHaveProperty("password");
  });

  test("401 – sans token", async () => {
    const res = await request(app).get("/user/me");
    expect(res.status).toBe(401);
  });

  test("404 – utilisateur introuvable", async () => {
    User.findByPk.mockResolvedValue(null);

    const res = await request(app).get("/user/me").set(AUTH);
    expect(res.status).toBe(404);
  });
});

// ── PATCH /user ───────────────────────────────────────────────────────────────

describe("PATCH /user", () => {
  test("200 – mise à jour du nom", async () => {
    User.findByPk.mockResolvedValue({ ...FAKE_USER, save: vi.fn() });
    User.findOne.mockResolvedValue(null);
    argon2.verify.mockResolvedValue(true);

    const res = await request(app)
      .patch("/user/me")
      .set(AUTH)
      .send({ name: "NewName", currentPassword: "Password1" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name");
  });

  test("200 – mise à jour de l'email", async () => {
    User.findByPk.mockResolvedValue({ ...FAKE_USER, save: vi.fn() });
    User.findOne.mockResolvedValue(null);
    argon2.verify.mockResolvedValue(true);

    const res = await request(app)
      .patch("/user/me")
      .set(AUTH)
      .send({ email: "new@example.com", currentPassword: "Password1" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("email");
  });

  test("200 – mise à jour du mot de passe", async () => {
    User.findByPk.mockResolvedValue({ ...FAKE_USER, save: vi.fn() });
    argon2.verify.mockResolvedValue(true);
    argon2.hash.mockResolvedValue("newHashed");

    const res = await request(app).patch("/user/me").set(AUTH).send({
      password: "NewPassword1",
      currentPassword: "Password1",
    });
    expect(res.status).toBe(200);
  });

  test("400 – aucun champ fourni", async () => {
    User.findByPk.mockResolvedValue(FAKE_USER);

    const res = await request(app).patch("/user/me").set(AUTH).send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/aucune modification/i);
  });

  test("400 – nouveau mot de passe sans mot de passe actuel", async () => {
    User.findByPk.mockResolvedValue(FAKE_USER);

    const res = await request(app)
      .patch("/user/me")
      .set(AUTH)
      .send({ password: "NewPassword1" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/actuel/i);
  });

  test("401 – sans token", async () => {
    const res = await request(app).patch("/user/me").send({ name: "NewName" });
    expect(res.status).toBe(401);
  });

  test("401 – mot de passe actuel incorrect", async () => {
    User.findByPk.mockResolvedValue({ ...FAKE_USER, save: vi.fn() });
    argon2.verify.mockResolvedValue(false);

    const res = await request(app).patch("/user/me").set(AUTH).send({
      password: "NewPassword1",
      currentPassword: "WrongPassword1",
    });
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/incorrect/i);
  });

  test("409 – nom déjà utilisé", async () => {
    User.findByPk.mockResolvedValue({ ...FAKE_USER, save: vi.fn() });
    User.findOne.mockResolvedValue({ id: 2, name: "NewName" });

    const res = await request(app)
      .patch("/user/me")
      .set(AUTH)
      .send({ name: "NewName" });
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/pseudo/i);
  });

  test("409 – email déjà utilisé", async () => {
    User.findByPk.mockResolvedValue({ ...FAKE_USER, save: vi.fn() });
    User.findOne.mockResolvedValue({ id: 2, email: "taken@example.com" });
    argon2.verify.mockResolvedValue(true); // ← ajouter

    const res = await request(app)
      .patch("/user/me")
      .set(AUTH)
      .send({ email: "taken@example.com", currentPassword: "Password1" }); // ← ajouter currentPassword
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/email/i);
  });
});

// ── DELETE /user ──────────────────────────────────────────────────────────────

describe("DELETE /user", () => {
  test("200 – suppression réussie", async () => {
    User.findByPk.mockResolvedValue({ ...FAKE_USER, destroy: vi.fn() });
    argon2.verify.mockResolvedValue(true);

    const res = await request(app)
      .delete("/user/me")
      .set(AUTH)
      .send({ password: "Password1" });
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/supprim/i);
  });

  test("400 – mot de passe manquant", async () => {
    const res = await request(app).delete("/user/me").set(AUTH).send({});
    expect(res.status).toBe(400);
  });

  test("401 – sans token", async () => {
    const res = await request(app)
      .delete("/user/me")
      .send({ password: "Password1" });
    expect(res.status).toBe(401);
  });

  test("401 – mot de passe incorrect", async () => {
    User.findByPk.mockResolvedValue({ ...FAKE_USER, destroy: vi.fn() });
    argon2.verify.mockResolvedValue(false);

    const res = await request(app)
      .delete("/user/me")
      .set(AUTH)
      .send({ password: "WrongPassword1" });
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/incorrect/i);
  });
});
