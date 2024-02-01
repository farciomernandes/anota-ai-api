import { config } from 'dotenv';
const ENVIRONMENTS = Object.freeze({
  test: ['.env.test'],
  stage: ['.env.stage', '.env'],
  development: ['.env.development', '.env'],
  production: ['.env'],
});
export const setEnvironment = () => {
  return ENVIRONMENTS[process.env.NODE_ENV];
};
config(setEnvironment());
export const Env = process.env;
