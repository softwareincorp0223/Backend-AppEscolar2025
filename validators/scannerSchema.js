import Joi from "joi";

const schema = Joi.object({
  id_scanner: Joi.string(),
  nombre: Joi.string(),
  apellido: Joi.string(),
  correo: Joi.string().email(),
  usuario: Joi.string(),
  contrasena: Joi.string(),
  sid_instituto: Joi.string()
});

export default schema;
