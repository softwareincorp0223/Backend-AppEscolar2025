import Joi from "joi";

const schema = Joi.object({
  id_materia: Joi.string(),
  sid_grado: Joi.string(),
  nombre: Joi.string().required(),
  sid_instituto: Joi.string()
});

export default schema;
