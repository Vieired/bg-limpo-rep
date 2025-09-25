// Representa um campo genérico do Firestore
export type FirestoreValue =
  | { stringValue: string }
  | { integerValue: string }
  | { booleanValue: boolean }
  | { arrayValue: { values: FirestoreValue[] } };

// Documento retornado pela API
export interface FirestoreDocument {
  name: string;
  fields: Record<string, FirestoreValue>;
  createTime: string;
  updateTime: string;
}

// Resposta quando lista documentos
export interface FirestoreListResponse {
  documents: FirestoreDocument[];
}