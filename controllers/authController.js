// controllers/authController.js
import jwt from "jsonwebtoken";
import Administrador from "../models/administrador.js";
import Usuario from "../models/usuario.js";
import { comparePassword } from "../helpers/password.js";

const generarToken = (datos) => {
  return jwt.sign(datos, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const login = async (req, res) => {
  const { correo, contrasena, tipo } = req.body;

  if (!correo || !contrasena || !tipo)
    return res.status(400).json({ error: "Correo, contraseña y tipo son requeridos" });

  try {
    let user = null;

    if (tipo === "admin") {
      user = await Administrador.findOne({ where: { correo } });
    } else if (tipo === "usuario") {
      user = await Usuario.findOne({ where: { correo } });
    } else {
      return res.status(400).json({ error: "Tipo de usuario inválido" });
    }
    console.log(user)
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    const isMatch = await comparePassword(contrasena, user.contrasena);
    if (!isMatch) return res.status(401).json({ msg: "Contraseña incorrecta" });

    const payload = {
      id: user.id_admin || user.id_usuario,
      correo: user.correo,
      tipo,
      sid_instituto: user.sid_instituto,
      privilegios: user.privilegios || null
    };

    const token = generarToken(payload);

    return res.json({ mensaje: "Autenticación exitosa", token, usuario: payload });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
