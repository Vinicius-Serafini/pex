import { NextApiRequest, NextApiResponse } from "next";
import { getRandomImage } from "Server/services/imageService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(400).json({ message: 'This route is only accept get methods' });
  }

  try {
    const url = await getRandomImage();

    return res.status(200).json({ url });
  } catch (err) {
    return res.status(502).json({ message: 'Error when requesting the photos api' });
  }
}