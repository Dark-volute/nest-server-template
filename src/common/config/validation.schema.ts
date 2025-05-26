import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number(),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // 数据库配置验证
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),

  // JWT配置验证
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().pattern(/^\d+[smhd]$/).default('60m'),
}); 