import Joi from "joi";

const schema = Joi.object({
  privilegios_id: Joi.string().required(),
  nombre_privilegio: Joi.string().required()
});

export default schema;
