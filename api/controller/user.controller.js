import Joi from "joi";
import argon2 from "argon2";
import { User } from "../models/index.js";
import { Op } from "sequelize";
import { StatusCodes } from "http-status-codes";

export const userController = {
  async UserInfo(req, res) {
    try {
      const userId = req.userId;
      const user = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
      });
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Utilisateur non trouve",
        });
      }
      res.json(user);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Erreur lors de la recuperation du profil",
      });
    }
  },

  async updateProfile(req, res) {
    try {
      const userId = req.userId;

      // Schema de validation aligne sur les regles du front
      const updateSchema = Joi.object({
        name: Joi.string().min(1).max(100).trim(),
        email: Joi.string().email().max(255).trim(),
        password: Joi.string()
          .min(8)
          .max(128)
          .pattern(/[A-Z]/, "majuscule")
          .pattern(/[0-9]/, "chiffre"),
        currentPassword: Joi.string().min(1).max(128),
      });

      // Validation propre sans Joi.attempt qui peut crasher le serveur
      const { error, value } = updateSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Donnees invalides",
          details: error.details.map((d) => d.message),
        });
      }

      const { name, email, password, currentPassword } = value;

      // Aucun champ fourni
      if (!name && !email && !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Aucune modification fournie",
        });
      }

      // Mot de passe actuel obligatoire si changement de mot de passe
      if (password && !currentPassword) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message:
            "Le mot de passe actuel est requis pour changer le mot de passe",
        });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Utilisateur non trouve",
        });
      }

      // Verification et changement du mot de passe
      if (password) {
        const validPassword = await argon2.verify(
          user.password,
          currentPassword,
        );
        if (!validPassword) {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Mot de passe actuel incorrect",
          });
        }
        user.password = await argon2.hash(password);
      }

      // Verification unicite du nom
      if (name && name !== user.name) {
        const nameExists = await User.findOne({
          where: { name, id: { [Op.ne]: userId } },
        });
        if (nameExists) {
          return res.status(StatusCodes.CONFLICT).json({
            message: "Ce nom est deja utilise",
          });
        }
        user.name = name;
      }

      // Verification unicite de l email
      if (email && email !== user.email) {
        const emailExists = await User.findOne({
          where: { email, id: { [Op.ne]: userId } },
        });
        if (emailExists) {
          return res.status(StatusCodes.CONFLICT).json({
            message: "Cet email est deja utilise",
          });
        }
        user.email = email;
      }

      await user.save();

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        message: "Profil mis a jour avec succes",
      });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Erreur lors de la mise a jour du profil",
      });
    }
  },

  async deleteAccount(req, res) {
    try {
      const userId = req.userId;

      // Schema de validation — mot de passe obligatoire
      const deleteSchema = Joi.object({
        password: Joi.string().min(1).max(128).required(),
      });

      const { error, value } = deleteSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Mot de passe requis pour supprimer le compte",
        });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Utilisateur non trouve",
        });
      }

      // Verification du mot de passe avant suppression
      const validPassword = await argon2.verify(user.password, value.password);
      if (!validPassword) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Mot de passe incorrect",
        });
      }

      await user.destroy();

      res.status(StatusCodes.OK).json({
        message: "Compte supprime avec succes",
      });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Erreur lors de la suppression du compte",
      });
    }
  },
};
