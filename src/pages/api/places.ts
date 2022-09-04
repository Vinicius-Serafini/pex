import { NextApiRequest, NextApiResponse } from "next";
import { geocode } from "Server/services/placesService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(400).json({ message: 'This route is only accept get methods' });
  }

  const { search } = req.query;

  if (!search) {
    return res.status(400).json({ message: 'This route expects a search param' });
  }

  try {
    const places = await geocode(search as string);

    return res.status(200).json({ places });
  } catch (err) {
    return res.status(502).json({ message: 'Error when requesting the places api' });
  }
}