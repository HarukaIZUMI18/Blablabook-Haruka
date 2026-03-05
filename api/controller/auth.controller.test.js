import { describe, test, expect, vi, beforeAll, beforeEach } from "vitest";

// On remplace les vraies dépendances par des fonctions simulées (mocks)
// pour ne pas avoir besoin d'une base de données pendant les tests
const User = { findOne: vi.fn(), create: vi.fn() };
const argon2 = { hash: vi.fn(), verify: vi.fn() };

// vi.mock() est automatiquement hissé avant les imports par Vitest
// Donc quand index.js charge models/index.js et argon2, il reçoit nos mocks
vi.mock("../models/index.js", () => ({
  User,
  Book: {},
  Collect: {},
  sequelize: {},
}));
vi.mock("argon2", () => ({ default: argon2 }));

// On importe app et supertest APRÈS que les mocks soient enregistrés
// supertest permet de faire de vraies requêtes HTTP sans lancer de serveur
let app, request;
beforeAll(async () => {
  ({ default: app } = await import("../index.js"));
  ({ default: request } = await import("supertest"));
});

// Remet toutes les fonctions mockées à zéro entre chaque test
// pour qu'un test n'influence pas le suivant
beforeEach(() => vi.clearAllMocks());

process.env.JWT_SECRET = "test_secret";

// ── Fixtures : données de test réutilisables ──────────────────────────────────

const VALID_REGISTER = {
  email: "test@example.com",
  name: "TestUser",
  password: "Password1",
  confirm: "Password1",
};
const VALID_LOGIN = { email: "test@example.com", password: "Password1" };

// Simule ce que retournerait User.findOne() ou User.create() depuis la BDD
const FAKE_USER = {
  id: 1,
  email: "test@example.com",
  name: "TestUser",
  password: "hashed",
};

// ── POST /auth/register ───────────────────────────────────────────────────────

describe("POST /auth/register", () => {
  test("201 – succès", async () => {
    // Scénario : email/nom disponibles, hash réussi, création réussie
    User.findOne.mockResolvedValue(null);
    argon2.hash.mockResolvedValue("hashed");
    User.create.mockResolvedValue(FAKE_USER);

    const res = await request(app).post("/auth/register").send(VALID_REGISTER);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: 1,
      email: "test@example.com",
      nom: "TestUser",
    });
    expect(res.body).not.toHaveProperty("password"); // le mot de passe ne doit jamais être renvoyé
  });

  test("400 – email invalide", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ ...VALID_REGISTER, email: "not-an-email" });
    expect(res.status).toBe(400);
  });

  test("400 – mot de passe trop court", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ ...VALID_REGISTER, password: "Ab1", confirm: "Ab1" });
    expect(res.status).toBe(400);
  });

  test("400 – mot de passe sans majuscule", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ ...VALID_REGISTER, password: "password1", confirm: "password1" });
    expect(res.status).toBe(400);
  });

  test("400 – mot de passe sans chiffre", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ ...VALID_REGISTER, password: "Password", confirm: "Password" });
    expect(res.status).toBe(400);
  });

  test("400 – confirm différent", async () => {
    // Le controller vérifie manuellement que password === confirm
    const res = await request(app)
      .post("/auth/register")
      .send({ ...VALID_REGISTER, confirm: "Different1" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/confirmation/i); // le message doit mentionner "confirmation"
  });

  test("409 – email ou nom déjà utilisé", async () => {
    // Scénario : un utilisateur avec ce nom/email existe déjà en BDD
    User.findOne.mockResolvedValue(FAKE_USER);
    const res = await request(app).post("/auth/register").send(VALID_REGISTER);
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/déjà utilisé/i);
  });
});

// ── POST /auth/login ──────────────────────────────────────────────────────────

describe("POST /auth/login", () => {
  test("200 – succès avec token JWT", async () => {
    // Scénario : utilisateur trouvé et mot de passe correct
    User.findOne.mockResolvedValue(FAKE_USER);
    argon2.verify.mockResolvedValue(true); // comparaison hash → true

    const res = await request(app).post("/auth/login").send(VALID_LOGIN);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token"); // un token JWT doit être présent
    expect(res.body.user).toMatchObject({ id: 1, email: "test@example.com" });
  });

  test("400 – body vide", async () => {
    // Joi rejette les données malformées avant tout traitement
    const res = await request(app).post("/auth/login").send({});
    expect(res.status).toBe(400);
  });

  test("400 – email invalide", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ ...VALID_LOGIN, email: "bad" });
    expect(res.status).toBe(400);
  });

  test("401 – utilisateur introuvable", async () => {
    // Scénario : aucun compte avec cet email
    User.findOne.mockResolvedValue(null);
    const res = await request(app).post("/auth/login").send(VALID_LOGIN);
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/incorrect/i);
  });

  test("401 – mot de passe incorrect", async () => {
    // Scénario : compte trouvé mais le hash ne correspond pas
    User.findOne.mockResolvedValue(FAKE_USER);
    argon2.verify.mockResolvedValue(false); // comparaison hash → false
    const res = await request(app).post("/auth/login").send(VALID_LOGIN);
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/incorrect/i);
  });

  test("401 – anti-énumération : même message pour user inconnu et mauvais mdp", async () => {
    // Sécurité : le message d'erreur doit être identique que l'email existe ou non
    // pour qu'un attaquant ne puisse pas deviner si un email est enregistré
    User.findOne.mockResolvedValue(null);
    const r1 = await request(app).post("/auth/login").send(VALID_LOGIN);

    User.findOne.mockResolvedValue(FAKE_USER);
    argon2.verify.mockResolvedValue(false);
    const r2 = await request(app).post("/auth/login").send(VALID_LOGIN);

    expect(r1.body.message).toBe(r2.body.message);
  });
});
