import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class Book extends Model {}

Book.init(
  {
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cover: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publish_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "book",
    tableName: "BOOK",
  },
);