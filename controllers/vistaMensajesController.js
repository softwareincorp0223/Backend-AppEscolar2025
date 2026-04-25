import VistaMensajes from "../models/vista_mensajes.js";
import createCRUD from "./core/genericController.js";

const crud = createCRUD(VistaMensajes, "id_mensaje");

export const getAll = crud.getAll;
