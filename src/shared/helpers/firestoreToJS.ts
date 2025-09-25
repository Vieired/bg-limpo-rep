import type { FirestoreValue } from "../models/domain/Firestore";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getValue = (field: FirestoreValue): string | number | boolean | any => {
  if ("stringValue" in field) return field.stringValue as string;
  if ("integerValue" in field) return parseInt(field.integerValue) as number;
  if ("booleanValue" in field) return field.booleanValue as boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ("arrayValue" in field) return field.arrayValue.values.map(getValue) as any;
  return null;
}