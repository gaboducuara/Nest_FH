import * as Joi from 'joi';

// reglas de validacion para las variables de entorno
export const JoiValidationSchema = Joi.object({
  MONGODB: Joi.required(),
  PORT: Joi.number().default(3004),
  DEFAULT_LIMIT: Joi.number().default(6),
})
