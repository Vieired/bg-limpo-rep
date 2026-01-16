export interface Auth {
    email: string;
    password: string;
}

export type FirebaseTokenValidationResult = {
  valid: boolean;
  user?: {
    uid: string;
    email?: string;
  };
  error?: string;
};