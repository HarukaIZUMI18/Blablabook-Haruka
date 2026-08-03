import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class Comment extends Model {}

Comment.init(
  {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "comment",
    tableName: "COMMENT",
  },
);