import Joi from "joi";

const schema = Joi.object({
  id_asignar_evento: Joi.string().required(),
  sid_evento: Joi.string().required(),
  sid_alumno: Joi.string().required(),
  leido: Joi.string().required()
});

export default schema;
