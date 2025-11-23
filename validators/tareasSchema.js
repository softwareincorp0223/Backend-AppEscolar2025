import Joi from "joi";

const schema = Joi.object({
  id_tareas: Joi.string(),
  sid_grupo: Joi.string(),
  sid_materia: Joi.string().required(),
  sid_instituto: Joi.string(),
  instrucciones_tarea: Joi.string().required(),
  fecha_creacion: Joi.date()
});

export default schema;
