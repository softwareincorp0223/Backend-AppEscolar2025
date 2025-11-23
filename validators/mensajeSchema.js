import Joi from "joi";

const schema = Joi.object({
  id_mensaje: Joi.string(),
  receptor: Joi.string(),
  sid_usuario_emisor: Joi.string().required(),
  sid_tipo: Joi.string(),
  sid_alumno: Joi.string().required(),
  sid_nivel: Joi.string().required(),
  sid_grado: Joi.string().required(),
  sid_grupo: Joi.string().required(),
  sid_extracurricular: Joi.string().required(),
  destinatarios: Joi.string(),
  asunto: Joi.string(),
  mensaje: Joi.string(),
  respuesta_rapida: Joi.string(),
  mensaje_programado: Joi.string(),
  fecha_envio: Joi.date(),
  hora_envio: Joi.date(),
  repetir: Joi.string(),
  periodo: Joi.string(),
  fecha_fin: Joi.date(),
  leido: Joi.string().required(),
  eliminado: Joi.string().required(),
  sid_instituto: Joi.string()
});

export default schema;
