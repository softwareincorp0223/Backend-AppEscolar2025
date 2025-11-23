import AsignarTutor from "../models/asignar_tutor.js";
import createCRUD from "./core/genericController.js";
import schema from "../validators/asignar_tutorSchema.js";

const crud = createCRUD(AsignarTutor, "id_asignar_tutor");

export const getAll = crud.getAll;
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