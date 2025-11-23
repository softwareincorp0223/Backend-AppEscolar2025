import Joi from "joi";

const schema = Joi.object({
  sesiones_app: Joi.string().required(),
  sid_padre: Joi.string().required(),
  token_sesion: Joi.string().required(),
  fecha_inicio: Joi.date().required()
});

export default schema;
