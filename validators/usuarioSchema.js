import Joi from "joi";

const schema = Joi.object({
  id_usuario: Joi.string(),
  nombre: Joi.string(),
  apellido: Joi.string(),
  correo: Joi.string().email(),
  sid_rol: Joi.string(),
  contrasena: Joi.string(),
  creacion: Joi.date().required(),
  modificacion: Joi.date().required(),
  sid_instituto: Joi.string().required()
});

export default schema;
