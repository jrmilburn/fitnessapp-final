'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Button from '@/components/library/Button';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Call the registration API
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Registration failed');
      return;
    }

    // Optionally, sign in automatically after registration
    const signInResponse = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (signInResponse?.error) {
      setError(signInResponse.error);
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <div className='w-full min-h-screen flex flex-col justify-center items-center relative'>
        <h2 className='mb-8'>Register</h2>
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
          text="Register"
          type="button"
          onClick={handleSubmit}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <div><span className='opacity-[0.5]'>Already have an account? </span> 
        <Link href="/auth/login" className='group inline-block'>
          Sign In
          <div className='h-[1px] w-[0] bg-black group-hover:w-full transition-all duration-500'></div>
        </Link>
      </div>
    </div>
  );
}
