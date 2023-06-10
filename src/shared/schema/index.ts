import { Static, TSchema, Type } from '@sinclair/typebox';

const DateType = <T extends TSchema>(schema: T) =>
  Type.Unsafe<Date>({ ...schema });

export const DateSchema = DateType(Type.String({ format: 'date-time' }));

export function Nullable<T extends TSchema>(schema: T) {
  return Type.Unsafe<Static<T> | null>({ ...schema, nullable: true });
}

export function StringEnum<T extends string[]>(values: [...T]) {
  return Type.Unsafe<T[number]>({ type: 'string', enum: values });
}

export const BaseResponseSchema = Type.Object({
  success: Type.Boolean(),
  message: Type.String()
});
