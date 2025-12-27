import Joi from "joi";

const schema = Joi.object({
  id_alumno_extracurricular: Joi.string(),
  sid_extracurricular: Joi.string(),
  sid_alumno: Joi.string(),
  fecha_ingreso: Joi.date().required(),
});

export default schema;
