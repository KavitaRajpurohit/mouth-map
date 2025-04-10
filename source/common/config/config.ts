import dotenv from 'dotenv';
import path from 'path';
import Joi from '@hapi/joi';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string()
      .required()
      .description('Mongo DB url'),
    JWT_SECRET: Joi.string()
      .required()
      .description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description('days after which refresh tokens expire'),
    EMAIL_FROM: Joi.string().description('refers to the sender of the email'),
    SEND_GRID_KEY: Joi.string().description('Send grid key which is used to send the emails')
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  console.log(error);
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_EXPIRATION_MINUTES,
    verifyPasswordExpirationMinutes: envVars.JWT_VERIFY_EXPIRATION_MINUTES, // expire token after 1 year
  },
  email: {
    sendGridKey: envVars.SEND_GRID_KEY,
    from: envVars.EMAIL_FROM,
  },
};
