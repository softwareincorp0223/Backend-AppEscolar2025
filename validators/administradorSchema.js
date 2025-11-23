import Joi from "joi";

const schema = Joi.object({
  id_admin: Joi.string(),
  nombre: Joi.string(),
  apellido: Joi.string(),
  correo: Joi.string(),
  contrasena: Joi.string().required(),
  privilegios: Joi.string(),
});

export default schema;
