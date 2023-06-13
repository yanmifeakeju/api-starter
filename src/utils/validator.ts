import addFormats from 'ajv-formats';
import Ajv, { AnySchema, DefinedError } from 'ajv';
import { schemaErrorMessageGenerator } from './error-message.js';
import { AppError } from '../libs/error/AppError.js';

export const ajv = addFormats
  .default(new Ajv.default({}), [
    'date-time',
    'time',
    'date',
    'email',
    'hostname',
    'ipv4',
    'ipv6',
    'uri',
    'uri-reference',
    'uuid',
    'uri-template',
    'json-pointer',
    'relative-json-pointer',
    'regex'
  ])
  .addKeyword('kind')
  .addKeyword('modifier');

export function schemaValidator(schema: AnySchema) {
  const validate = ajv.compile(schema);

  return (payload: unknown) => {
    const isValid = validate(payload);

    if (!isValid)
      throw new AppError(
        'ILLEGAL_ARGUMENT',
        schemaErrorMessageGenerator(validate.errors as DefinedError[])
      );
  };
}
