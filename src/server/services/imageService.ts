import axios from "axios";

const BASE_URL = 'https://api.unsplash.com/'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Accept-Version': 'v1',
    Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
  }
});

export async function getRandomImage(): Promise<string> {
  const { data } = await api.get('photos/random?query=soccer&orientation=landscape');

  return data.urls.regular;
}