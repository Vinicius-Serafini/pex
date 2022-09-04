import axios from "axios"
import { Place } from "../types";

const BASE_URL = 'https://api.geoapify.com/v1/'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

export async function geocode(search: string): Promise<Array<Place>> {
  const { data } = await api.get(`geocode/search?text=${search}&limit=20&type=amenity&filter=countrycode:br&format=json&apiKey=${process.env.GEOAPIFY_GEOCODING_KEY}`);

  const { results } = data;

  return results
    .filter((place: any) => place.category && place.category.includes('sport'))
    .map((place: any): Place => {
      return {
        coordinates: {
          lat: place.lat,
          lon: place.lon
        },
        address: {
          city: place.city,
          postcode: place.postcode,
          state: {
            initials: place.state_code,
            name: place.state
          },
          street: place.street,
          suburb: place.suburb
        },
        name: place.name,
        place_id: place.place_id
      }
    });
}