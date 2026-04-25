import VistaHistorialMensajes from "../models/vista_historial_mensajes.js";
import createCRUD from "./core/genericController.js";

const crud = createCRUD(VistaHistorialMensajes, "id_mensaje");

export const getAll = crud.getAll;
