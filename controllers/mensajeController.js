import Mensaje from "../models/mensaje.js";
import createCRUD from "./core/genericController.js";
import schema from "../validators/mensajeSchema.js";

const crud = createCRUD(Mensaje, "id_mensaje");

const normalizeOptionalDate = (value) => {
  if (value === undefined) return undefined;
  if (value === null) return null;

  const normalized = String(value).trim();

  if (!normalized || normalized.toLowerCase() === "invalid date") {
    return null;
  }

  return value;
};

const normalizeMensajeBody = (body) => ({
  ...body,
  fecha_fin: normalizeOptionalDate(body.fecha_fin),
});

export const getAll = crud.getAll;

export const getById = crud.getById;

export const createOne = async (req, res) => {
  try {

    // VALIDAR
    const { error, value } = schema.validate(normalizeMensajeBody(req.body), {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        errors: error.details.map((d) => d.message),
      });
    }

    // BODY LIMPIO
    req.body = value;

    return crud.createOne(req, res);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: error.message,
    });

  }
};

export const updateOne = async (req, res) => {

    const updateSchema = schema.fork(
        Object.keys(schema.describe().keys),
        field => field.optional()
    );

    const { error, value } = updateSchema.validate(normalizeMensajeBody(req.body), {
        abortEarly: false
    });

    if (error) {
        return res.status(400).json({
            errors: error.details.map(d => d.message)
        });
    }

    req.body = value;

    return crud.updateOne(req, res);
};

export const deleteOne = crud.deleteOne;
