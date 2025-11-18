// Representa um campo genérico do Firestore
export type FirestoreValue =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { nullValue: null }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields?: Record<string, FirestoreValue> } }
  | { timestampValue: string }
  | { referenceValue: string }
  | { geoPointValue: { latitude: number; longitude: number } };

// Documento retornado pela API
export interface FirestoreDocument {
  name?: string;
  fields: Record<string, FirestoreValue>;
  createTime?: string;
  updateTime?: string;
}

// Resposta quando lista documentos
export interface FirestoreListResponse {
  documents: FirestoreDocument[];
}

export interface FirestoreListResponseV2 {
  document: FirestoreDocument[];
}

export interface FirestoreErrorResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  code: any; //FirestoreErrorCode
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any; //FirestoreErrorDetail[]
}