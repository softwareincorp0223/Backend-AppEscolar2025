import Instituto from "../models/instituto.js";
import Privilegios from "../models/privilegios.js";
import PrivilegiosRol from "../models/privilegios_rol.js";
import Rol from "../models/rol.js";
import sequelize from "../config/database.js";
import createCRUD from "./core/genericController.js";
import schema from "../validators/institutoSchema.js";
import { generadorID } from "../helpers/generadorID.js";

const crud = createCRUD(Instituto, "id_instituto");
const ADMIN_ROLE_NAME = "Administrador";

const todayDate = () => new Date().toISOString().slice(0, 10);

export const getAll = crud.getAll;
export const getById = crud.getById;
export const createOne = async (req, res) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });

  const transaction = await sequelize.transaction();

  try {
    const created = await Instituto.create(value, { transaction });
    const roleId = generadorID(10);

    await Rol.create(
      {
        id_rol: roleId,
        sid_instituto: created.id_instituto,
        nombre: ADMIN_ROLE_NAME,
        fecha_registro: todayDate(),
      },
      { transaction }
    );

    const privilegios = await Privilegios.findAll({ transaction });

    if (privilegios.length > 0) {
      await PrivilegiosRol.bulkCreate(
        privilegios.map((privilegio) => ({
          privilegios_rol_id: generadorID(10),
          sid_rol: roleId,
          sid_privilegios: privilegio.privilegios_id,
          activo: "si",
        })),
        { transaction }
      );
    }

    await transaction.commit();

    return res.status(201).json({
      ...created.toJSON(),
      rol_administrador: {
        id_rol: roleId,
        nombre: ADMIN_ROLE_NAME,
        permisos_creados: privilegios.length,
      },
    });
  } catch (err) {
    await transaction.rollback();
    console.error("[instituto.createOne]", err);
    return res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
};
export const updateOne = async (req, res) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });
  req.body = value;
  return crud.updateOne(req, res);
};
export const deleteOne = crud.deleteOne;
