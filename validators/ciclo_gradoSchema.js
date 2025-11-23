import Joi from "joi";

const schema = Joi.object({
  id_ciclo_grado: Joi.string().required(),
  sid_ciclo: Joi.string().required(),
  sid_grado: Joi.string().required()
});

export default schema;
