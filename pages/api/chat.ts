// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { ChatGPTAPI } from 'chatgpt';
import { authenticate } from '@/middeware';

type Data = {
  response: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    authenticate(req, res, async () => {
        const turboModel:string = "gpt-3.5-turbo";
        const api = new ChatGPTAPI({
        apiKey: process.env.OPENAI_API_KEY || '',
        completionParams: {
          temperature: 0,
          max_tokens: 256,
          model: turboModel
        }
     })

    const openAiRes = await api.sendMessage(req.body.message);
    res.status(200).json({ response: openAiRes.text });
})
}
