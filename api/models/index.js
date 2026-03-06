import { User } from "./user.model.js";
import { Book } from "./book.model.js";
import { Collect } from "./collect.model.js";
import { sequelize } from "./sequelize.client.js";

// User <-> Book (many-to-many via Collect)
User.belongsToMany(Book, {
  through: Collect,
  foreignKey: "user_id",
});
Book.belongsToMany(User, {
  through: Collect,
  foreignKey: "book_id",
});

// Relation Collect -> User / Book via les clés étrangères de jointure

Collect.belongsTo(User, {
  foreignKey: "user_id",
});
Collect.belongsTo(Book, {
  foreignKey: "book_id",
});

export { User, Book, Collect, sequelize };
