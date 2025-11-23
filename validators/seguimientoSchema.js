import Joi from "joi";

const schema = Joi.object({
  id_seguimiento: Joi.string(),
  sid_alumno: Joi.string().required(),
  observacion: Joi.string().required(),
  fecha_registro: Joi.date(),
  leido: Joi.string().required(),
  fecha_visto: Joi.date(),
  responsable: Joi.string().required(),
  fecha_eliminacion: Joi.date(),
  eliminado: Joi.string().required(),
  sid_usuario: Joi.string().required()
});

export default schema;
