import Joi from "joi";

const schema = Joi.object({
  id_archivo: Joi.string(),
  nombre_archivo: Joi.string(),
  estado: Joi.string(),
  fecha: Joi.date().required(),
  modulo: Joi.string(),
  sid_instituto: Joi.string()
});

export default schema;
