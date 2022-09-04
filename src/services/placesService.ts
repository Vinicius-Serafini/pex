import axios from "axios"
import { Place } from "../types";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

export async function getPlaces(search: string): Promise<Array<Place>> {
  const { data } = await api.get(`/api/places?search=${search}`);

  return data.places;
}