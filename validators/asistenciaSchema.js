import Joi from "joi";

const schema = Joi.object({
  id_asistencia: Joi.string(),
  sid_alumno: Joi.string(),
  fecha_ingreso: Joi.date(),
  hora: Joi.date(),
  tipo: Joi.string(),
  leido: Joi.string(),
  sid_usuario: Joi.string()
});

export default schema;
