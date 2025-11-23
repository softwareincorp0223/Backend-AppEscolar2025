import Joi from "joi";

const schema = Joi.object({
  id_ciclo: Joi.string(),
  nombre: Joi.string(),
  sid_instituto: Joi.string(),
  ciclo_cerrado: Joi.number(),
  orden: Joi.number()
});

export default schema;
