import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secretKey = new TextEncoder().encode(process.env.SESSION_SECRET)

export async function createSession(userId) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey)

  // ✅ cookies() is async in Next.js 16
  const cookieStore = await cookies()
  await cookieStore.set('session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  await cookieStore.delete('session')
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = (await cookieStore).get('session')?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, secretKey)
    return payload
  } catch {
    return null
  }
}
