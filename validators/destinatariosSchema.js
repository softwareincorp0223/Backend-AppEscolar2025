import Joi from "joi";

const schema = Joi.object({
  id_destinatarios: Joi.string().required(),
  sid_alumno: Joi.string().required(),
  sid_mensaje: Joi.string().required()
});

export default schema;
