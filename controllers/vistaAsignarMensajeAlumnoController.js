import VistaAsignarMensajeAlumno from "../models/vista_asignar_mensaje_alumno.js";
import createCRUD from "./core/genericController.js";

const crud = createCRUD(VistaAsignarMensajeAlumno, "id_asignar_mensaje");

export const getAll = crud.getAll;
