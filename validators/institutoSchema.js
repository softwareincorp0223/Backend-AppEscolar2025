import Joi from "joi";

const schema = Joi.object({
  id_instituto: Joi.string(),
  nombre: Joi.string(),
  logo: Joi.string(),
  correo: Joi.string().email(),
  banco: Joi.string(),
  cuenta_banco: Joi.string(),
  descripcion: Joi.string(),
  fecha_inicio_licencia: Joi.date(),
  fecha_limite: Joi.date(),
  politicas: Joi.string(),
  nombre_beneficiario: Joi.string(),
  asistencia: Joi.number(),
  pago: Joi.number(),
  fecha_creacion: Joi.date(),
  sid_usuario: Joi.string()
});

export default schema;
