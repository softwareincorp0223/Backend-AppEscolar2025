import Joi from "joi";

const schema = Joi.object({
  id_archivo_respuesta_tarea: Joi.string().required(),
  archivo: Joi.string().required(),
  sid_asignar_tarea: Joi.string().required()
});

export default schema;
