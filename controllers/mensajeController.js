import Mensaje from "../models/mensaje.js";
import createCRUD from "./core/genericController.js";
import schema from "../validators/mensajeSchema.js";

const crud = createCRUD(Mensaje, "id_mensaje");

export const getAll = crud.getAll;

export const getById = crud.getById;

export const createOne = async (req, res) => {
  try {

    //console.log("BODY:");
    //console.log(req.body);

    //console.log("FILES:");
    //console.log(req.files);

    // VALIDAR
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        errors: error.details.map((d) => d.message),
      });
    }

    // BODY LIMPIO
    req.body = value;

    // SI QUIERES GUARDAR ARCHIVOS
    // ejemplo:
    // if (req.files?.archivo?.[0]) {
    //   req.body.archivo = req.files.archivo[0].filename;
    // }

    return crud.createOne(req, res);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: error.message,
    });

  }
};

export const updateOne = async (req, res) => {
  try {

    console.log("BODY:");
    console.log(req.body);

    console.log("FILES:");
    console.log(req.files);

    return res.json({
      ok: true,
      body: req.body,
      files: req.files,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

export const deleteOne = crud.deleteOne;