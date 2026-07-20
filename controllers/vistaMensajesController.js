import VistaMensajes from "../models/vista_mensajes.js";
import createCRUD from "./core/genericController.js";

const crud = createCRUD(VistaMensajes, "id_mensaje");

export const getAll = crud.getAll;

export const getAllExcel = async (req, res) => {
  try {
    const { sid_instituto } = req.params;

    const data = await VistaMensajes.findAll({
      where: { sid_instituto },
      order: [["fecha_envio", "DESC"]],
    });

    return res.json(data);
  } catch (error) {
    console.error("[getAllExcel]", error);
    return res.status(500).json({ error: "Error al obtener mensajes" });
  }
};
