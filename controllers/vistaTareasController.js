import VistaTareas from "../models/vistaTareas.js";
import createCRUD from "./core/genericController.js";

const crud = createCRUD(VistaTareas, "id_tarea");

export const getAll = crud.getAll;
