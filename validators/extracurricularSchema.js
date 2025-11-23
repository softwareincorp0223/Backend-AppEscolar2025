import Joi from "joi";

const schema = Joi.object({
  id_extracurricular: Joi.string(),
  nombre: Joi.string(),
  sid_instituto: Joi.string()
});

export default schema;
