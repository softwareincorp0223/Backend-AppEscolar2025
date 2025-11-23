import Joi from "joi";

const schema = Joi.object({
  id_grado: Joi.string(),
  sid_nivel: Joi.string(),
  nombre: Joi.string(),
  orden: Joi.number().required()
});

export default schema;
