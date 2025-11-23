import Joi from "joi";

const schema = Joi.object({
  id_alumno: Joi.string(),
  id_padre: Joi.string(),
  nombre: Joi.string(),
  sid_instituto: Joi.string(),
  id_asistencia: Joi.string(),
  id_evaluacion: Joi.string(),
  id_pago: Joi.string(),
  id_grado: Joi.string(),
  id_grupo: Joi.string(),
  receptor: Joi.string(),
  id_mensaje: Joi.string(),
  sid_instituto: Joi.string(),
  id_seguimiento: Joi.string(),
  id_tareas: Joi.string(),
  sid_grado: Joi.string(),
  id_admin: Joi.string().required(),
  nombre: Joi.string(),
  apellido: Joi.string(),
  correo: Joi.string().email(),
  contrasena: Joi.string(),
  privilegios: Joi.string()
});

export default schema;
