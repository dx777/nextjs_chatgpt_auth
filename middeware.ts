import { type NextMiddleware, NextResponse } from 'next/server'
import * as jose from 'jose'
import { NextApiRequest, NextApiResponse } from 'next'
export const middleware: NextMiddleware = () => {
  return NextResponse.next({
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })
}

export const verifyToken = (token: string) => {
  // Get token from request headers
  try {
    const decoded = jose.jwtVerify(
      token,
      new TextEncoder().encode(`${process.env.NEXT_PUBLIC_JWT_KEY}`)
    )
    return decoded
  } catch (err) {
    throw new Error('Invalid token')
  }
}

export function authenticate(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const decoded = verifyToken(token)
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
