import Joi from "joi";

const schema = Joi.object({
  id_asignar_mensaje: Joi.string().required(),
  sid_alumno: Joi.string().required(),
  sid_mensaje: Joi.string().required(),
  respuesta_rapida: Joi.string(),
  leido: Joi.string().required()
});

export default schema;
