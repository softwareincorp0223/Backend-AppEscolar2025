import EscuelasRegistradas from "../models/escuelas_registradas.js";
import Administrador from "../models/administrador.js";
import Instituto from "../models/instituto.js";
import Privilegios from "../models/privilegios.js";
import PrivilegiosRol from "../models/privilegios_rol.js";
import Rol from "../models/rol.js";
import Usuario from "../models/usuario.js";
import sequelize from "../config/database.js";
import { Op } from "sequelize";
import createCRUD from "./core/genericController.js";
import schema from "../validators/escuelas_registradasSchema.js";
import { generadorID } from "../helpers/generadorID.js";
import { hashPassword } from "../helpers/password.js";
import { sendMail } from "../helpers/mailer.js";

const crud = createCRUD(EscuelasRegistradas, "escuelas_registradas_id");
const ADMIN_ROLE_NAME = "Administrador";

const todayDate = () => new Date().toISOString().slice(0, 10);

const addOneMonth = (date) => {
  const limit = new Date(date);
  limit.setMonth(limit.getMonth() + 1);
  return limit.toISOString().slice(0, 10);
};

const generatePassword = () =>
  `${generadorID(4)}-${generadorID(4)}-${generadorID(4)}`;

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const uniqueId = async (Model, length, transaction) => {
  let id = generadorID(length);
  let exists = await Model.findByPk(id, { transaction });

  while (exists) {
    id = generadorID(length);
    exists = await Model.findByPk(id, { transaction });
  }

  return id;
};

const buildAcceptedEmail = ({ escuela, correo, password }) => {
  const appUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const schoolName = escuela.nombre_clave || "tu escuela";

  return {
    to: correo,
    subject: "Tu escuela fue aceptada en Aplicacion Escolar",
    text: [
      `Hola ${escuela.nombre_contacto || ""},`,
      "",
      `Tu escuela ${schoolName} fue aceptada para usar Aplicacion Escolar.`,
      "",
      `Liga del sistema: ${appUrl}`,
      `Usuario: ${correo}`,
      `Contrasena temporal: ${password}`,
      "",
      "Puedes ingresar con estos datos para comenzar tu demo.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #222; line-height: 1.5;">
        <h2 style="margin-bottom: 8px;">Tu escuela fue aceptada</h2>
        <p>Hola ${escapeHtml(escuela.nombre_contacto)},</p>
        <p>
          La escuela <strong>${escapeHtml(schoolName)}</strong> fue aceptada
          para usar Aplicacion Escolar.
        </p>
        <div style="background: #f6f8fb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 18px 0;">
          <p style="margin: 0 0 8px;"><strong>Liga del sistema:</strong> <a href="${escapeHtml(appUrl)}">${escapeHtml(appUrl)}</a></p>
          <p style="margin: 0 0 8px;"><strong>Usuario:</strong> ${escapeHtml(correo)}</p>
          <p style="margin: 0;"><strong>Contrasena temporal:</strong> ${escapeHtml(password)}</p>
        </div>
        <p>Puedes ingresar con estos datos para comenzar tu demo.</p>
      </div>
    `,
  };
};

export const getAll = async (req, res) => {
  try {
    const escuelas = await EscuelasRegistradas.findAll();
    const correos = [
      ...new Set(
        escuelas
          .map((escuela) => String(escuela.correo_contacto || "").trim())
          .filter(Boolean)
      ),
    ];

    const [usuarios, institutos] = correos.length
      ? await Promise.all([
          Usuario.findAll({
            where: { correo: { [Op.in]: correos } },
            attributes: ["correo", "sid_instituto"],
          }),
          Instituto.findAll({
            where: { correo: { [Op.in]: correos } },
            attributes: ["id_instituto", "correo", "sid_usuario"],
          }),
        ])
      : [[], []];

    const usuariosPorCorreo = new Map(
      usuarios.map((usuario) => [
        String(usuario.correo || "").trim().toLowerCase(),
        usuario,
      ])
    );
    const institutosPorCorreo = new Map(
      institutos.map((instituto) => [
        String(instituto.correo || "").trim().toLowerCase(),
        instituto,
      ])
    );

    const data = escuelas.map((escuela) => {
      const correo = String(escuela.correo_contacto || "").trim().toLowerCase();
      const usuario = usuariosPorCorreo.get(correo);
      const instituto = institutosPorCorreo.get(correo);

      return {
        ...escuela.toJSON(),
        aceptada: Boolean(usuario),
        id_instituto_aceptado: usuario?.sid_instituto || instituto?.id_instituto || null,
      };
    });

    return res.json(data);
  } catch (err) {
    console.error("[escuelas_registradas.getAll]", err);
    return res.status(500).json({ error: "Server error" });
  }
};
export const getById = crud.getById;
export const createOne = async (req, res) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });
  req.body = value;
  return crud.createOne(req, res);
};
export const updateOne = async (req, res) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });
  req.body = value;
  return crud.updateOne(req, res);
};
export const deleteOne = crud.deleteOne;

export const acceptSchool = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const escuela = await EscuelasRegistradas.findByPk(req.params.id, {
      transaction,
    });

    if (!escuela) {
      await transaction.rollback();
      return res.status(404).json({ error: "Escuela registrada no encontrada" });
    }

    const correo = escuela.correo_contacto;
    const existingUser = await Usuario.findOne({
      where: { correo },
      transaction,
    });

    if (existingUser) {
      await transaction.rollback();
      return res.status(409).json({
        error: "Ya existe un usuario registrado con este correo",
      });
    }

    let admin = await Administrador.findOne({
      where: { correo },
      transaction,
    });

    let instituto = await Instituto.findOne({
      where: { correo },
      transaction,
    });

    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const userId = await uniqueId(Usuario, 10, transaction);
    const password = generatePassword();

    if (!admin) {
      admin = await Administrador.create(
        {
          id_admin: await uniqueId(Administrador, 10, transaction),
          nombre: escuela.nombre_contacto,
          apellido: "",
          correo,
          contrasena: await hashPassword(password),
          privilegios: "B",
        },
        { transaction }
      );
    }

    if (!instituto) {
      instituto = await Instituto.create(
        {
          id_instituto: await uniqueId(Instituto, 10, transaction),
          nombre: escuela.nombre_clave,
          logo: null,
          correo,
          banco: null,
          cuenta_banco: null,
          descripcion: null,
          fecha_inicio_licencia: today,
          fecha_limite: addOneMonth(now),
          politicas: null,
          nombre_beneficiario: null,
          asistencia: 0,
          pago: 0,
          fecha_creacion: now,
          sid_usuario: null,
        },
        { transaction }
      );
    }

    let role = await Rol.findOne({
      where: {
        sid_instituto: instituto.id_instituto,
        nombre: ADMIN_ROLE_NAME,
      },
      transaction,
    });

    if (!role) {
      role = await Rol.create(
        {
          id_rol: await uniqueId(Rol, 10, transaction),
          sid_instituto: instituto.id_instituto,
          nombre: ADMIN_ROLE_NAME,
          fecha_registro: todayDate(),
        },
        { transaction }
      );
    }

    const privilegios = await Privilegios.findAll({ transaction });

    if (privilegios.length > 0) {
      const permisosExistentes = await PrivilegiosRol.findAll({
        where: { sid_rol: role.id_rol },
        transaction,
      });
      const permisosExistentesIds = new Set(
        permisosExistentes.map((permiso) => permiso.sid_privilegios)
      );
      const permisosFaltantes = privilegios.filter(
        (privilegio) => !permisosExistentesIds.has(privilegio.privilegios_id)
      );

      await PrivilegiosRol.bulkCreate(
        permisosFaltantes.map((privilegio) => ({
          privilegios_rol_id: generadorID(10),
          sid_rol: role.id_rol,
          sid_privilegios: privilegio.privilegios_id,
          activo: "si",
        })),
        { transaction }
      );
    }

    const usuario = await Usuario.create(
      {
        id_usuario: userId,
        nombre: escuela.nombre_contacto,
        apellido: "",
        correo,
        sid_rol: role.id_rol,
        contrasena: await hashPassword(password),
        creacion: now,
        modificacion: now,
        sid_instituto: instituto.id_instituto,
      },
      { transaction }
    );

    await instituto.update({ sid_usuario: usuario.id_usuario }, { transaction });

    await sendMail(buildAcceptedEmail({ escuela, correo, password }));

    await transaction.commit();

    return res.status(201).json({
      message: "Escuela aceptada y correo enviado correctamente",
      correo_enviado: true,
      institucion: {
        id_instituto: instituto.id_instituto,
        nombre: instituto.nombre,
        correo: instituto.correo,
        fecha_inicio_licencia: instituto.fecha_inicio_licencia,
        fecha_limite: instituto.fecha_limite,
      },
      administrador: {
        id_admin: admin.id_admin,
        nombre: admin.nombre,
        correo: admin.correo,
      },
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        sid_rol: usuario.sid_rol,
        sid_instituto: usuario.sid_instituto,
      },
      rol_administrador: {
        id_rol: role.id_rol,
        nombre: ADMIN_ROLE_NAME,
        permisos_creados: privilegios.length,
      },
    });
  } catch (err) {
    await transaction.rollback();
    console.error("[escuelas_registradas.acceptSchool]", err);
    return res.status(500).json({
      error: "No se pudo aceptar la escuela",
      details: err.message,
    });
  }
};
