import Joi from "joi";

const schema = Joi.object({
  privilegios_rol_id: Joi.string().required(),
  sid_rol: Joi.string().required(),
  sid_privilegios: Joi.string().required(),
  activo: Joi.string().required()
});

export default schema;
