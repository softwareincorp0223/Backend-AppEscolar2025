import Joi from "joi";

const schema = Joi.object({
  id_pago: Joi.string(),
  sid_alumno: Joi.string(),
  modo: Joi.string(),
  concepto: Joi.string(),
  monto: Joi.number(),
  sid_penalidad: Joi.string(),
  status: Joi.number(),
  fecha_pago: Joi.date(),
  sid_usuario: Joi.string()
});

export default schema;
