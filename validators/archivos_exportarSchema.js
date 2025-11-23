import Joi from "joi";

const schema = Joi.object({
  archivos_exportar_id: Joi.string().required(),
  nombre_archivo: Joi.string().required(),
  fecha_subida: Joi.date().required(),
  estado: Joi.string().required(),
  modulo: Joi.string().required(),
  usuario_sid: Joi.string().required()
});

export default schema;
