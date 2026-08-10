// controllers/authController.js
import jwt from "jsonwebtoken";
import Administrador from "../models/administrador.js";
import Usuario from "../models/usuario.js";
import PrivilegiosRol from "../models/privilegios_rol.js";
import Privilegios from "../models/privilegios.js";
import sequelize from "../config/database.js";
import { comparePassword, hashPassword } from "../helpers/password.js";
import { getModuleKeysFromPermissions } from "../config/permissionModules.js";
import { sendMail } from "../helpers/mailer.js";

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

const generarContrasena = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 10; i += 1) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const buildPasswordResetEmail = ({ usuario, password }) => {
  const appUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  return {
    to: usuario.correo,
    subject: "RECUPERACION DE CONTRASENA - APLICACION ESCOLAR",
    text: [
      `Hola ${usuario.nombre || ""},`,
      "",
      "Tu contrasena fue restablecida correctamente.",
      `Liga del sistema: ${appUrl}`,
      `Usuario: ${usuario.correo}`,
      `Nueva contrasena: ${password}`,
    ].join("\n"),
    html: `<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <title>[APLICACION ESCOLAR]</title>
      <style type="text/css">
        body {
         padding-top: 0 !important;
         padding-bottom: 0 !important;
         margin:0 !important;
         width: 100% !important;
         -webkit-text-size-adjust: 100% !important;
         -ms-text-size-adjust: 100% !important;
         -webkit-font-smoothing: antialiased !important;
         font-family: arial;
         background-color: white;
       }
      table[class="body"], td[class="cell"] {
        width: 100% !important;
        height:auto !important;
      }
      </style>
    </head>
    <body paddingwidth="0" paddingheight="0" style="padding-top: 0; padding-bottom: 0; background-repeat: repeat; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased;" offset="0" toppadding="0" leftpadding="0">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
      <tbody>
        <tr>
          <td><br><br>
            <table width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="white" align="center" class="MainContainer" style="border: 5px solid white;">
              <tbody>
                <tr>
                  <td>
                    <div style="color: black; padding: 40px 40px 20px 40px;">
                      <div style="background-color: white; padding: 20px 20px 0 20px;" align="center">
                        <img src="https://ik.imagekit.io/softwareincorp/logo.png?updatedAt=1744653623126" alt="" width="60%" height="">
                      </div>
                      <div style="padding: 0px 40px 10px 40px;">
                        <h2 style="font-size: 30px; border-left: 4px solid black; padding-left: 5px; color:black; margin-top: 20px;">Recuperacion de acceso <span style="color: #0399fd !important;">Aplicacion Escolar</span></h2>
                        <p style="margin-bottom: 20px; font-size: 18px; line-height: 24px;">Hola ${escapeHtml(usuario.nombre || "usuario")}, tu contrasena fue restablecida correctamente. Estos son tus nuevos datos de acceso:</p>
                        <p style="margin-bottom: 10px; font-size: 18px; line-height: 24px;"><strong>Liga:</strong> <a href="${escapeHtml(appUrl)}">${escapeHtml(appUrl)}</a></p>
                        <p style="margin-bottom: 10px; font-size: 18px; line-height: 24px;"><strong>Usuario:</strong> ${escapeHtml(usuario.correo)}</p>
                        <p style="margin-bottom: 20px; font-size: 18px; line-height: 24px;"><strong>Nueva contrasena:</strong> ${escapeHtml(password)}</p>
                      </div>
                      <div style="background-color: transparent; padding: 30px;" align="center"></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    </body>
    </html>`,
  };
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

export const resetPassword = async (req, res) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ error: "El correo es requerido" });
  }

  const transaction = await sequelize.transaction();

  try {
    const usuario = await Usuario.findOne({ where: { correo }, transaction });

    if (!usuario) {
      await transaction.rollback();
      return res.status(404).json({ error: "No existe un usuario con este correo" });
    }

    const nuevaContrasena = generarContrasena();

    await usuario.update({
      contrasena: await hashPassword(nuevaContrasena),
      modificacion: new Date(),
    }, { transaction });

    await sendMail(
      buildPasswordResetEmail({
        usuario,
        password: nuevaContrasena,
      })
    );

    await transaction.commit();

    return res.json({
      message: "Se envio una nueva contrasena al correo registrado",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("[resetPassword]", error);
    return res.status(500).json({
      error: "No se pudo restaurar la contrasena",
      details: error.message,
    });
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
