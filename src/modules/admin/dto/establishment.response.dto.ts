// Ce DTO définit la forme de l'objet que nous renvoyons au client.
// Il n'a pas besoin de validation.
export class EstablishmentResponseDto {
    id: string;
    name: string;
    apiKey: string;
    latitude: number;
    longitude: number;
    geofenceRadius: number;
    partnerId: string;
    partnerEmail: string;
  }