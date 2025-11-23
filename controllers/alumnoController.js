import Alumno from "../models/alumno.js";
import createCRUD from "./core/genericController.js";
import schema from "../validators/alumnoSchema.js";

const crud = createCRUD(Alumno, "id_alumno");

export const getAll = crud.getAll;

export const alumnosPadres = async (req, res) => {
  try {
    const { sid_instituto } = req.params;

    const padresAlumnos = await Alumno.findAll({
      where: { sid_instituto }
    });

    return res.json(padresAlumnos);
  } catch (error) {
    console.error("[alumnosPadres]", error);
    return res.status(500).json({ error: "Error al obtener alumnos" });
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