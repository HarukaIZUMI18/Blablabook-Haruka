import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class Thread extends Model {}

Thread.init(
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "thread",
    tableName: "THREAD",
  },
);