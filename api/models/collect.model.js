import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class Collect extends Model {}

Collect.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "USER",
        key: "id",
      },
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "BOOK",
        key: "id",
      },
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "collect",
    tableName: "COLLECT",
    timestamps: false,
  },
);