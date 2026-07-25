// controllers/authController.js
import jwt from "jsonwebtoken";
import Administrador from "../models/administrador.js";
import Usuario from "../models/usuario.js";
import PrivilegiosRol from "../models/privilegios_rol.js";
import Privilegios from "../models/privilegios.js";
import { comparePassword } from "../helpers/password.js";
import { getModuleKeysFromPermissions } from "../config/permissionModules.js";

const isActive = (value) =>
  value === true ||
  value === 1 ||
  String(value).toLowerCase() === "si" ||
  String(value).toLowerCase() === "true" ||
  String(value) === "1" ||
  String(value).toLowerCase() === "activo";

const generarToken = (datos) => {
  return jwt.sign(datos, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const getPermisosActivos = async (sidRol) => {
  if (!sidRol) return { privilegios: [], permisos_configurados: false };

  const permisosRol = await PrivilegiosRol.findAll({
    where: { sid_rol: sidRol },
  });

  const privilegiosIds = permisosRol
    .filter((permiso) => isActive(permiso.activo))
    .map((permiso) => permiso.sid_privilegios);

  const privilegios = privilegiosIds.length
    ? await Privilegios.findAll({
        where: { privilegios_id: privilegiosIds },
      })
    : [];

  return {
    permisos_configurados: permisosRol.length > 0,
    privilegios: getModuleKeysFromPermissions(privilegios),
  };
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

    const permisos =
      tipo === "usuario"
        ? await getPermisosActivos(user.sid_rol)
        : { privilegios: [], permisos_configurados: false };

    const payload = {
      id: user.id_admin || user.id_usuario,
      correo: user.correo,
      tipo,
      sid_rol: user.sid_rol || null,
      sid_instituto: user.sid_instituto,
      privilegios: permisos.privilegios,
      permisos_configurados: permisos.permisos_configurados,
    };

    const token = generarToken(payload);

    return res.json({ mensaje: "Autenticación exitosa", token, usuario: payload });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getMyPermissions = async (req, res) => {
  try {
    if (req.user?.tipo === "admin") {
      return res.json({ privilegios: [], sid_rol: null });
    }

    const user = await Usuario.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const permisos = await getPermisosActivos(user.sid_rol);

    return res.json({
      sid_rol: user.sid_rol || null,
      privilegios: permisos.privilegios,
      permisos_configurados: permisos.permisos_configurados,
    });
  } catch (error) {
    console.error("[getMyPermissions]", error);
    return res.status(500).json({ error: "Error al obtener permisos" });
  }
};
