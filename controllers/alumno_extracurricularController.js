import AlumnoExtracurricular from "../models/alumno_extracurricular.js";
import Alumno from "../models/alumno.js";
import Extracurricular from "../models/extracurricular.js";
import Nivel from "../models/nivel.js";
import Grado from "../models/grado.js";
import Grupo from "../models/grupo.js";
import createCRUD from "./core/genericController.js";
import schema from "../validators/alumno_extracurricularSchema.js";

const crud = createCRUD(AlumnoExtracurricular, "id_alumno_extracurricular");

export const getAll = crud.getAll;

export const getAllExcel = async (req, res) => {
  try {
    const { sid_instituto } = req.params;

    const data = await AlumnoExtracurricular.findAll({
      include: [
        {
          model: Extracurricular,
          required: true // INNER JOIN
        },
        {
          model: Alumno,
          required: true, // INNER JOIN
          where: { sid_instituto },
          include: [
            {
              model: Nivel,
              required: false // LEFT JOIN
            },
            {
              model: Grado,
              required: false // LEFT JOIN
            },
            {
              model: Grupo,
              required: false // LEFT JOIN
            }
          ]
        }
      ]
    });

    return res.json(data);
  } catch (error) {
    console.error("[getAllExcel]", error);
    return res.status(500).json({ error: "Error al obtener datos" });
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