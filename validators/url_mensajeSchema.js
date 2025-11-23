import Joi from "joi";

const schema = Joi.object({
  id_url: Joi.string(),
  sid_mensaje: Joi.string(),
  url: Joi.string()
});

export default schema;
