import Joi from "joi";

const schema = Joi.object({
  id_grupo: Joi.string(),
  sid_grado: Joi.string(),
  nombre: Joi.string()
});

export default schema;
