import SignupForm from '@/app/ui/signup-form'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e0f]">
      <div className="max-w-md w-full p-8 bg-[#1e1e20] rounded-xl shadow-lg border border-[#2e2e30]">
        <h1 className="text-3xl font-semibold text-gray-100 mb-6 text-center">
          Create an Account
        </h1>
        <SignupForm />
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-emerald-400 hover:text-emerald-300 font-medium transition"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  )
}
