import AsignarMateria from "../models/asignar_materia.js";
import createCRUD from "./core/genericController.js";
import schema from "../validators/asignar_materiaSchema.js";
import Materia from "../models/materia.js";
import { Op } from "sequelize";

const crud = createCRUD(AsignarMateria, "id_asignar_materia");

export const getAll = crud.getAll;

export const consultaSelectMateria = async (req, res) => {
  console.log("consultaSelectMateria called with query:", req.query);
  try {
    const { sid_instituto, id_nivel, id_grado, id_grupo } = req.query;

    const materias = await AsignarMateria.findAll({
      attributes: ["id_asignar_materia"],
      where: {
        sid_nivel: id_nivel,
        sid_grado: id_grado,
        sid_grupo: id_grupo,
      },
      include: [
        {
          model: Materia,
          attributes: ["id_materia", "nombre"],
          where: {
            sid_instituto,
          },
          required: true,
        },
      ],
    });

    console.log(JSON.stringify(materias, null, 2));

    const resultado = materias.map((m) => ({
      id_asignar_materia: m.id_asignar_materia,
      id_materia: m.Materium.id_materia,
      nombre: m.Materium.nombre,
    }));

    return res.json(resultado);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const getById = crud.getById;

const existeAsignacionDuplicada = async (data, id_asignar_materia) => {
  const where = {
    sid_materia: data.sid_materia,
    sid_profesor: data.sid_profesor,
    sid_nivel: data.sid_nivel,
    sid_grado: data.sid_grado,
    sid_grupo: data.sid_grupo,
  };

  if (id_asignar_materia) {
    where.id_asignar_materia = { [Op.ne]: id_asignar_materia };
  }

  return AsignarMateria.findOne({ where });
};

export const createOne = async (req, res) => {
  console.log("Validating request body:", req.body);
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });

  const duplicado = await existeAsignacionDuplicada(value);
  if (duplicado) {
    return res.status(409).json({
      message: "Ya existe una asignación con la misma materia, profesor, nivel, grado y grupo",
    });
  }

  req.body = value;
  return crud.createOne(req, res);
};
export const updateOne = async (req, res) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });

  const duplicado = await existeAsignacionDuplicada(value, req.params.id);
  if (duplicado) {
    return res.status(409).json({
      message: "Ya existe una asignación con la misma materia, profesor, nivel, grado y grupo",
    });
  }

  req.body = value;
  return crud.updateOne(req, res);
};
export const deleteOne = crud.deleteOne;
