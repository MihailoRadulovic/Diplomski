export interface KorisnikProfil {
  id: string;
  email: string;
  puno_ime?: string;
  avatar_url?: string;
  created_at: string;
}

export interface LoginFormState {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
}

export interface RegisterFormState {
  errors?: {
    puno_ime?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
  success?: boolean;
}
