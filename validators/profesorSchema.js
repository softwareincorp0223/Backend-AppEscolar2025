import Joi from "joi";

const schema = Joi.object({
  id_profesor: Joi.string(),
  nombre: Joi.string(),
  apellido: Joi.string(),
  sid_instituto: Joi.string()
});

export default schema;
