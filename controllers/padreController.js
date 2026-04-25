import Padre from "../models/padre.js";
import createCRUD from "./core/genericController.js";
import schema from "../validators/padreSchema.js";
import { encryptQR } from "../helpers/cryptoQR.js";

const crud = createCRUD(Padre, "id_padre");

//export const getAll = crud.getAll;

export const getAll = async (req, res) => {
  try {
    const originalJson = res.json.bind(res);

    res.json = (data) => {
      // 🔥 convertir a objeto plano
      let parsed = Array.isArray(data)
        ? data.map((item) => item.toJSON ? item.toJSON() : item)
        : data;

      // 🔥 aplicar encrypt a TODOS
      if (Array.isArray(parsed)) {
        parsed = parsed.map((item) => {
          if (item.codigo_qr) {
            item.codigo_qr = encryptQR(item.codigo_qr);
          }
          return item;
        });
      } else {
        if (parsed.codigo_qr) {
          parsed.codigo_qr = encryptQR(parsed.codigo_qr);
        }
      }

      return originalJson(parsed);
    };

    return crud.getAll(req, res);

  } catch (error) {
    console.error("[getAll alumno]", error);
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