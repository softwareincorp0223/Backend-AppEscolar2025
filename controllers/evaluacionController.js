import Evaluacion from "../models/evaluacion.js";
import createCRUD from "./core/genericController.js";
import schema from "../validators/evaluacionSchema.js";
import Alumno from "../models/alumno.js";
import Nivel from "../models/nivel.js";
import Grado from "../models/grado.js";
import Grupo from "../models/Grupo.js";
import Calificaciones from "../models/calificaciones.js";
import Materia from "../models/materia.js";

const crud = createCRUD(Evaluacion, "id_evaluacion");

export const getAll = crud.getAll;

export const getEvaluacion = async (req, res) => {
  try {
    const { sid_instituto } = req.params;

    const data = await Evaluacion.findAll({

      include: [
        {
          model: Alumno,
          attributes: [
            "nombre",
            "apellido",
            "matricula"
          ],
          required: true,
          where: { sid_instituto },

          include: [
            {
              model: Nivel,
              attributes: ["nombre"],
              required: false
            },
            {
              model: Grado,
              attributes: ["nombre"],
              required: false
            },
            {
              model: Grupo,
              attributes: ["nombre"],
              required: false
            }
          ]
        }
      ],

      raw: true,
      nest: true,
      subQuery: false
    });

    return res.json(data);

  } catch (error) {
    console.error("[getEvaluacion]", error);
    return res.status(500).json({ error: "Error al obtener datos" });
  }
};

export const getAllExcel = async (req, res) => {
  try {
    const { sid_instituto } = req.params;

    const data = await Evaluacion.findAll({

      
      include: [
        {
          model:Calificaciones,
          required: true,
          include:[
            {
              model:Materia,
              required: true,
            },
          ],
        },
        {
          model: Alumno,
          attributes: [
            "nombre",
            "apellido",
            "matricula"
          ],
          required: true,
          where: { sid_instituto },

          include: [
            {
              model: Nivel,
              attributes: ["nombre"],
              required: false
            },
            {
              model: Grado,
              attributes: ["nombre"],
              required: false
            },
            {
              model: Grupo,
              attributes: ["nombre"],
              required: false
            }
          ]
        }
      ],

      raw: true,
      nest: true,
      subQuery: false
    });

    return res.json(data);

  } catch (error) {
    console.error("[getEvaluacion]", error);
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