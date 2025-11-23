import Joi from "joi";

const schema = Joi.object({
  id_penalidad: Joi.string(),
  porcentaje: Joi.number(),
  sid_instituto: Joi.string()
});

export default schema;
