import Joi from "joi";

const schema = Joi.object({
  id_evento: Joi.string(),
  nombre: Joi.string(),
  // fecha: Joi.date(),
  fecha: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
  hora: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .required(),
  todos: Joi.number(),
  nivel: Joi.string(),
  grado: Joi.string(),
  grupo: Joi.string(),
  sid_instituto: Joi.string()
});

export default schema;
