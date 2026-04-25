import VistaAsignacionMaterias from "../models/vista_asignacion_materias.js";
import createCRUD from "./core/genericController.js";

const crud = createCRUD(VistaAsignacionMaterias, "sid_instituto");

export const getAll = crud.getAll;
