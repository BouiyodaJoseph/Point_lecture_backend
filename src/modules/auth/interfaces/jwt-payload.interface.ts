export interface JwtPayload {
    sub: string; // Subject (ID de l'utilisateur)
    name: string;
    role: string;
    email: string; // <-- AJOUTER CETTE LIGNE
  }