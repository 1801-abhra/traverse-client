export type RideStatus = 'REQUESTED' | 'ACCEPTED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface LocationData {
  address: string;
  lat: number;
  lng: number;
}

export interface Ride {
  _id?: string;
  id?: string;
  student?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  driver?: {
    _id: string;
    name: string;
    email: string;
    vehicleNumber?: string;
    vehicle?: string;
  } | null;
  // Backend returns either string or object with address/lat/lng
  pickup: string | LocationData;
  dropoff?: string | LocationData;
  drop?: LocationData; // Backend uses "drop" not "dropoff"
  status: RideStatus;
  emergency?: boolean;
  fare?: number;
  createdAt?: string;
  updatedAt?: string;
  requestedAt?: string;
}
