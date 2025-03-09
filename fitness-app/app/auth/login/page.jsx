// pages/auth/signin.tsx
'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '../../../components/library/Button'
import Link from 'next/link'

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
        router.push('/workout');
    }
  }
return (
  <div className='w-full min-h-screen flex flex-col justify-center items-center relative'>
  <h2 className='mb-8'>Sign In</h2>
    <form className='flex flex-col items-center gap-6 mb-4'>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className='min-w-60 border-b border-black/30 p-1' 
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className='min-w-60 border-b border-black/30 p-1 mb-4'
      />
      <Button 
        text="Sign In"
        type="button"
        onClick={handleSubmit}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
    <div><span className='opacity-[0.5]'>Don't have an account? </span> 
      <Link href="/auth/register" className='group inline-block'>
        Register
        <div className='h-[1px] w-[0] bg-black group-hover:w-full transition-all duration-500'></div>
      </Link>
    </div>
</div>
  )
}