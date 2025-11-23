import Joi from "joi";

const schema = Joi.object({
  id_archivo_mensaje: Joi.string(),
  sid_mensaje: Joi.string(),
  url: Joi.string()
});

export default schema;
