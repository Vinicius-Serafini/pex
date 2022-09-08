import axios from "axios"
import { Place } from "../types";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 5000,
});

export async function getRandomImage(): Promise<string> {
  const { data } = await api.get('match/image');

  return data.url;
}