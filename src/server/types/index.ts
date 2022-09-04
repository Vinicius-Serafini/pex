export type Place = {
  coordinates: {
    lat: number;
    lon: number;
  };
  address: {
    state: {
      initials: string;
      name: string;
    };
    city: string;
    postcode: string;
    street: string;
    suburb: string;
  };
  name: string;
  place_id?: string;
}