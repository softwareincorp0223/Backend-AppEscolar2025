import Joi from "joi";

const schema = Joi.object({
  id_padre: Joi.string(),
  nombre: Joi.string(),
  apellido: Joi.string(),
  correo: Joi.string().email(),
  creacion: Joi.date(),
  contrasena: Joi.string(),
  codigo_qr: Joi.string().required(),
  sid_instituto: Joi.string()
});

export default schema;
