import Joi from "joi";

const schema = Joi.object({
  id_url_tarea: Joi.string().required(),
  sid_tarea: Joi.string().required(),
  url: Joi.string().required()
});

export default schema;
