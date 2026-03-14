import { Op } from "sequelize";
import sequelize from "../config/database.js";
import Nivel from "../models/nivel.js";
import createCRUD from "./core/genericController.js";
import schema from "../validators/nivelSchema.js";

const crud = createCRUD(Nivel, "id_nivel");

export const getAll = crud.getAll;
export const getById = crud.getById;
// export const createOne = async (req, res) => {
//   const { error, value } = schema.validate(req.body, { abortEarly: false });
//   if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });
//   req.body = value;
//   return crud.createOne(req, res);
// };

export const createOne = async (req, res) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error)
    return res.status(400).json({
      errors: error.details.map(d => d.message),
    });

  const transaction = await sequelize.transaction();

  try {
    const { sid_instituto, orden } = value;

    // Si no mandan orden → ponerlo al final
    let nuevoOrden = orden;

    if (!nuevoOrden) {
      const maxOrden = await Nivel.max("orden", {
        where: { sid_instituto },
      });

      nuevoOrden = maxOrden ? maxOrden + 1 : 1;
    } else {
      // Mover hacia abajo los que tengan orden >= nuevoOrden
      await Nivel.increment("orden", {
        by: 1,
        where: {
          sid_instituto,
          orden: { [Op.gte]: nuevoOrden },
        },
        transaction,
      });
    }

    const created = await Nivel.create(
      { ...value, orden: nuevoOrden },
      { transaction }
    );

    await transaction.commit();

    return res.status(201).json(created);
  } catch (err) {
    await transaction.rollback();
    console.error("[createOne]", err);
    return res.status(500).json({ error: err.message });
  }
};

export const updateOne = async (req, res) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });
  req.body = value;
  return crud.updateOne(req, res);
};
export const deleteOne = crud.deleteOne;