import Joi from "joi";

const schema = Joi.object({
  id_nivel: Joi.string(),
  sid_instituto: Joi.string(),
  nombre: Joi.string().required(),
  orden: Joi.number().required()
});

export default schema;
