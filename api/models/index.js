import { User } from "./user.model.js";
import { Book } from "./book.model.js";
import { Collect } from "./collect.model.js";
import { Thread } from "./thread.model.js";
import { Comment } from "./comment.model.js";
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

// User <-> Thread (one-to-many via Collect)
User.hasMany(Thread, {
  foreignKey: "user_id",
});
Thread.belongsTo(User, {
  foreignKey: "user_id",
});

// Thread <-> Comment (one-to-many)
Thread.hasMany(Comment, {
  foreignKey: "thread_id",
  onDelete: "CASCADE",
});
Comment.belongsTo(Thread, {
  foreignKey: "thread_id",
});

// User <-> Comment (one-to-many)
User.hasMany(Comment, {
  foreignKey: "user_id",
});
Comment.belongsTo(User, {
  foreignKey: "user_id",
});

export { User, Book, Collect, Thread, Comment, sequelize };
