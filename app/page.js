import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0e0e0f] text-gray-100 font-sans">
      <main className="flex flex-col items-center text-center px-8 sm:px-16">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold text-emerald-400">
            GPT
          </h1>
        </div>

        {/* Hero Text */}
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
          Talk. Learn. Create. All in one chat.
        </h2>
        <p className="max-w-xl text-zinc-400 text-lg mb-10">
          Experience the power of AI conversations. Ask questions, upload images, or start new ideas — 
          your AI assistant is ready.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/signup"
            className="px-8 py-3 rounded-full text-lg font-medium bg-emerald-500 text-black 
                       hover:bg-emerald-400 transition-colors"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 rounded-full text-lg font-medium border border-emerald-400 text-emerald-400 
                       hover:bg-emerald-400 hover:text-black transition-colors"
          >
            Log In
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-sm text-zinc-500">
          Built with ❤️ using <span className="text-emerald-400">Next.js</span> & <span className="text-emerald-400">Prisma</span>
        </footer>
      </main>
    </div>
  )
}
