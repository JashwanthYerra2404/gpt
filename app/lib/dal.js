import 'server-only'
 
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
// import { decrypt } from '@/app/lib/session'
// import { cache } from 'react'
// import { redirect } from 'next/dist/server/api-utils'

const secretKey = new TextEncoder().encode(process.env.SESSION_SECRET)
 
export async function verifySession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, secretKey)
    return { isAuth: true, userId: payload.userId }
  } catch {
    return null
  }
}

// export const getUser = cache(async () => {
//     const session = await verifySession()
//     if (!session) return null
   
//     try {
//       const data = await db.query.users.findMany({
//         where: eq(users.id, session.userId),
//         // Explicitly return the columns you need rather than the whole user object
//         columns: {
//           id: true,
//           name: true,
//           email: true,
//         },
//       })
   
//       const user = data[0]
   
//       return user;
//     } catch (error) {
//       console.log('Failed to fetch user')
//       return null
//     }
//   })