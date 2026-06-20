import Joi from "joi";

const schema = Joi.object({
  id_seguimiento: Joi.string(),
  sid_alumno: Joi.string(),
  observacion: Joi.string(),
  fecha_registro: Joi.date(),
  leido: Joi.string(),
  fecha_visto: Joi.date(),
  responsable: Joi.string(),
  fecha_eliminacion: Joi.date(),
  eliminado: Joi.string(),
  sid_usuario: Joi.string(),
}).unknown(true);

export default schema;
