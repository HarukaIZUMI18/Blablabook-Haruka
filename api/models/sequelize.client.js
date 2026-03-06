import { Sequelize } from "sequelize";

// Initialise la connexion Sequelize
export const sequelize = new Sequelize(
  process.env.DB_URL,
  {
    logging: false,
    define: {
      timestamps: true, 
      underscored: true, 
      createdAt: "created_at", 
      updatedAt: "updated_at"
    }
  }
);