export interface LoginCredentials {
  name: string;
  email: string;
}

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface Pagination {
  prev?: string;
  next?: string;
}

export interface DogFilter {
  breeds: Array<string>;
  zipCodes: Array<string>;
  ageMin: number | null;
  ageMax: number | null;
  size: number;
  from?: any;
  sort: string;
}

export interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface GeoBoundingBox {
  top?: Coordinates;
  left?: Coordinates;
  bottom?: Coordinates;
  right?: Coordinates;
  bottom_left?: Coordinates;
  top_right?: Coordinates;
  bottom_right?: Coordinates;
  top_left?: Coordinates;
}

export interface LocationFilter {
  city?: String;
  states?: Array<string>;
  geoBoundingBox?: GeoBoundingBox;
}
