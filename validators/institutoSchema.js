import Joi from "joi";

const schema = Joi.object({
  id_instituto: Joi.string().allow(null, ""),
  nombre: Joi.string().allow(null, ""),
  logo: Joi.string().allow(null, ""),
  correo: Joi.string().email().allow(null, ""),
  banco: Joi.string().allow(null, ""),
  cuenta_banco: Joi.string().allow(null, ""),
  descripcion: Joi.string().allow(null, ""),
  fecha_inicio_licencia: Joi.date(),
  fecha_limite: Joi.date(),
  politicas: Joi.string().allow(null, ""),
  nombre_beneficiario: Joi.string().allow(null, ""),
  asistencia: Joi.number(),
  pago: Joi.number(),
  fecha_creacion: Joi.date(),
  sid_usuario: Joi.string().allow(null, "")
});

export default schema;
