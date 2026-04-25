import AsignarAtributo from "../models/asignar_atributo.js";
import createCRUD from "./core/genericController.js";
import schema from "../validators/asignar_atributoSchema.js";
import Alumno from "../models/alumno.js";
import Nivel from "../models/nivel.js";
import Grado from "../models/grado.js";
import Grupo from "../models/Grupo.js";
import Atributo from "../models/atributo.js";
import Seguimiento from "../models/seguimiento.js";
import { Op } from "sequelize";

const crud = createCRUD(AsignarAtributo, "id_asignar_atributo");

export const getAll = crud.getAll;

export const getAllExcel = async (req, res) => {
  try {
    const { sid_instituto } = req.params;

    const data = await AsignarAtributo.findAll({
      attributes: [
        "valor_atributo",
        "fecha_registro"
      ],

      where: {
        fecha_registro: {
          [Op.between]: ["2026-01-01", "2026-12-31"]
        }
      },

      include: [
        {
          model: Atributo,
          attributes: ["nombre"], // a.nombre
          required: true
        },
        {
          model: Seguimiento,
          attributes: [
            "observacion",
            "leido",
            "fecha_eliminacion",
            "eliminado"
          ],
          required: false,
          include: [
            {
              model: Alumno,
              attributes: [
                "nombre",
                "apellido",
                "matricula"
              ],
              required: false,
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
          ]
        }
      ],

      raw: true,
      nest: true,
      subQuery: false 
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