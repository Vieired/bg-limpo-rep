import type { FirestoreDocument, FirestoreValue } from "../models/domain/Firestore";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getValue = (field: FirestoreValue): string | number | boolean | any => {
  if ("stringValue" in field) return field.stringValue as string;
  if ("integerValue" in field) return parseInt(field.integerValue) as number;
  if ("booleanValue" in field) return field.booleanValue as boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ("arrayValue" in field) return field?.arrayValue?.values?.map(getValue) as any;
  return null;
}

// mappingFirestoreDocumentToGame() TODO: implementar esta função

// Função que converte FirestoreValue em valor JS
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseFirestoreValue(value: FirestoreValue): any {
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return parseInt(value.integerValue, 10);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("nullValue" in value) return null;
  if ("timestampValue" in value) return new Date(value.timestampValue);
  if ("referenceValue" in value) return value.referenceValue;
  if ("geoPointValue" in value) return value.geoPointValue;
  if ("arrayValue" in value) {
    return (value.arrayValue.values ?? []).map(parseFirestoreValue);
  }
  if ("mapValue" in value) {
    const fields = value.mapValue.fields ?? {};
    return Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [k, parseFirestoreValue(v)])
    );
  }
  return null;
}

// Converte o FirestoreDocument em objeto JSON simples
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function firestoreDocToJson(doc: FirestoreDocument): Record<string, any> {
  return Object.fromEntries(
    Object.entries(doc.fields).map(([key, value]) => [key, parseFirestoreValue(value)])
  );
}

// Função que converte valor JS em FirestoreValue
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toFirestoreValue(value: any): FirestoreValue {
  if (value === null) return { nullValue: null };

  switch (typeof value) {
    case "string":
      return { stringValue: value };
    case "number":
      // Se for inteiro, usa integerValue, senão doubleValue
      return Number.isInteger(value)
        ? { integerValue: value.toString() }
        : { doubleValue: value };
    case "boolean":
      return { booleanValue: value };
    case "object":
      if (value instanceof Date) {
        return { timestampValue: value.toISOString() };
      }
      if (Array.isArray(value)) {
        return { arrayValue: { values: value.map(toFirestoreValue) } };
      }
      if ("latitude" in value && "longitude" in value) {
        return { geoPointValue: value as { latitude: number; longitude: number } };
      }
      // Caso contrário, assume que é um objeto/mapa
      return {
        mapValue: {
          fields: Object.fromEntries(
            Object.entries(value).map(([k, v]) => [k, toFirestoreValue(v)])
          ),
        },
      };
    default:
      throw new Error(`Tipo não suportado: ${typeof value}`);
  }
}

// Converte objeto JS em FirestoreDocument
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function jsonToFirestoreDoc(obj: Record<string, any>): FirestoreDocument {
  return {
    fields: Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, toFirestoreValue(value)])
    ),
  };
}