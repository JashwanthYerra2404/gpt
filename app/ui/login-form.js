'use client'

import { login } from '@/app/actions/auth' // <-- Make sure you have a corresponding `login` action
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full py-2.5 mt-4 font-medium rounded-lg transition-colors 
      ${pending
        ? 'bg-emerald-700 cursor-not-allowed text-gray-300'
        : 'bg-emerald-500 hover:bg-emerald-400 text-black'}`}
    >
      {pending ? 'Logging in...' : 'Log In'}
    </button>
  )
}

export default function LoginForm() {
  const [state, formAction] = useActionState(login, null)

  return (
    <form action={formAction} className="space-y-5">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="w-full border border-[#2e2e30] bg-[#2a2a2d] text-gray-100 rounded-lg px-3 py-2 
                     focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder-gray-500"
        />
        {state?.errors?.email && (
          <p className="text-sm text-red-500 mt-1">{state.errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          className="w-full border border-[#2e2e30] bg-[#2a2a2d] text-gray-100 rounded-lg px-3 py-2 
                     focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder-gray-500"
        />
        {state?.errors?.password && (
          <p className="text-sm text-red-500 mt-1">{state.errors.password}</p>
        )}
      </div>

      {/* General error message */}
      {state?.errors?.general && (
        <p className="text-sm text-red-500 mt-2 text-center">{state.errors.general}</p>
      )}

      <SubmitButton />

      {/* Forgot password link */}
      <div className="text-right">
        <a
          href="/forgot-password"
          className="text-sm text-emerald-400 hover:text-emerald-300 transition"
        >
          Forgot password?
        </a>
      </div>
    </form>
  )
}
