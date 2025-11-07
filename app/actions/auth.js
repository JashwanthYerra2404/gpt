'use server'

import { SignupFormSchema, LoginFormSchema } from '@/app/lib/definitions'
import bcrypt from 'bcryptjs'
import { createUser, getUserByEmail } from '@/app/lib/db'
import { createSession, deleteSession } from '@/app/lib/session'
import { redirect } from 'next/navigation'

export async function signup(prevState, formData) {
  // ✅ Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, password } = validatedFields.data

  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    return {
      message: 'An account with this email already exists.',
    }
  }

  // ✅ Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // ✅ Create user in DB
  const user = await createUser(email, name, hashedPassword)
  if (!user) {
    return {
      message: 'An error occurred while creating your account.',
    }
  }

  // ✅ Create session & redirect
  await createSession(user.id)
  redirect('/chat')
}

export async function login(prevState, formData) {
  // ✅ Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data

  // ✅ Check if user exists
  const user = await getUserByEmail(email)
  if (!user) {
    return { message: 'Invalid email or password.' }
  }

  // ✅ Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return { message: 'Invalid email or password.' }
  }

  // ✅ Create session & redirect
  await createSession(user.id)
  redirect('/chat')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
