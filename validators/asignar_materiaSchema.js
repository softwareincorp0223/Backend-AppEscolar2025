import Joi from "joi";

const schema = Joi.object({
  id_asignar_materia: Joi.string().required(),
  sid_profesor: Joi.string().required(),
  sid_materia: Joi.string().required(),
  sid_nivel: Joi.string().required(),
  sid_grado: Joi.string().required(),
  sid_grupo: Joi.string().required(),
  sid_usuario: Joi.string().required(),
  fecha_creacion: Joi.date().required()
});

export default schema;
