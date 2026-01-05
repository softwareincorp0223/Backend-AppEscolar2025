import VistaRegistroMensajes from "../models/vista_registro_mensajes.js";
import createCRUD from "./core/genericController.js";

const crud = createCRUD(VistaRegistroMensajes, "id_mensaje");

export const getAll = crud.getAll;
