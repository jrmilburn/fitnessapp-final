// pages/auth/signin.tsx
'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

    const router = useRouter();

const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    
    if (result?.error) {
      setError(result.error)
    }

    if(result.ok) {
        router.push('/dashboard');
    }
  }
return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[30px] shadow-custom-top border-0 p-8 space-y-8">
        <h2 className="text-2xl font-normal">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded-[30px] border border-gray-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded-[30px] border border-gray-300"
          />
          {error && <div className="text-red-500">{error}</div>}
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-[30px]">
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}