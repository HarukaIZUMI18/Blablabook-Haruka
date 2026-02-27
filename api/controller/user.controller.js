import Joi from "joi";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { User } from "../models/index.js";
import { Op } from "sequelize";
import { StatusCodes } from "http-status-codes";

export const userController = {
  async UserInfo(req, res) {
    const userId = req.userId;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    res.json(user);
  },

  async updateProfile(req, res) {
    const userId = req.userId;

    // Schema de validation pour les champs optionnels
    const updateSchema = Joi.object({
      name: Joi.string().min(1),
      email: Joi.string().email(),
      password: Joi.string().min(8),
      currentPassword: Joi.string().min(8),
    });

    const { name, email, password, currentPassword } = Joi.attempt(
      req.body,
      updateSchema,
    );

    // Si changement de mot de passe, obligatoire de fournir le mot de passe actuel
    if (password && !currentPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Le mot de passe actuel est requis pour changer le mot de passe",
      });
    }

    // Récupérer l'utilisateur actuel
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Utilisateur non trouvé",
      });
    }

    // Vérifier le mot de passe actuel si changement de mot de passe
    if (password) {
      const validPassword = await argon2.verify(user.password, currentPassword);
      if (!validPassword) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Mot de passe actuel incorrect",
        });
      }
      // Hacher le nouveau mot de passe
      user.password = await argon2.hash(password);
    }

    // Vérifier unicité du nouveau nom (si fourni et différent)
    if (name && name !== user.name) {
      const nameExists = await User.findOne({
        where: { name, id: { [Op.ne]: userId } },
      });
      if (nameExists) {
        return res.status(StatusCodes.CONFLICT).json({
          message: "Ce nom est déjà utilisé",
        });
      }
      user.name = name;
    }

    // Vérifier unicité du nouvel email (si fourni et différent)
    if (email && email !== user.email) {
      const emailExists = await User.findOne({
        where: { email, id: { [Op.ne]: userId } },
      });
      if (emailExists) {
        return res.status(StatusCodes.CONFLICT).json({
          message: "Cet email est déjà utilisé",
        });
      }
      user.email = email;
    }

    await user.save();

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      message: "Profil mis à jour avec succès",
    });
  },

  async deleteAccount(req, res) {
    const userId = req.userId;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Utilisateur non trouvé",
      });
    }

    await user.destroy();

    res.status(StatusCodes.OK).json({
      message: "Compte supprimé avec succès",
    });
  },
};
