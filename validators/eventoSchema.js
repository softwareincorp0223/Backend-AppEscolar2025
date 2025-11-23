import Joi from "joi";

const schema = Joi.object({
  id_evento: Joi.string(),
  nombre: Joi.string(),
  fecha: Joi.date(),
  hora: Joi.date().required(),
  todos: Joi.number(),
  nivel: Joi.string(),
  grado: Joi.string(),
  grupo: Joi.string(),
  sid_instituto: Joi.string()
});

export default schema;
