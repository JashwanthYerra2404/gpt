'use client'

import { signup } from '@/app/actions/auth'
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
      {pending ? 'Signing up...' : 'Sign Up'}
    </button>
  )
}

export default function SignupForm() {
  const [state, formAction] = useActionState(signup, null);

  return (
    <form action={formAction} className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
          Name
        </label>
        <input
          id="name"
          name="name"
          placeholder="John Doe"
          required
          className="w-full border border-[#2e2e30] bg-[#2a2a2d] text-gray-100 rounded-lg px-3 py-2 
                     focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder-gray-500"
        />
        {state?.errors?.name && (
          <p className="text-sm text-red-500 mt-1">{state.errors.name}</p>
        )}
      </div>

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
          <div className="text-sm text-red-500 mt-1">
            <p>Password must:</p>
            <ul className="list-disc list-inside">
              {state.errors.password.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <SubmitButton />
    </form>
  )
}
