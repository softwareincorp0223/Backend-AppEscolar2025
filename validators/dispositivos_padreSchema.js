import Joi from "joi";

const schema = Joi.object({
  id_dispositivos_padre: Joi.string().required(),
  id_padre: Joi.string().required(),
  token_dispositivo: Joi.string().required(),
  badge_notificaciones: Joi.number()
});

export default schema;
