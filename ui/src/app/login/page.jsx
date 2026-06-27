'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(username, password);
      router.replace(user.role === 'admin' ? '/' : '/jobs');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white border border-slate-200">
        <div>
          <p className="text-xs uppercase tracking-widest text-blue-600 font-semibold mb-1">TaxFlow</p>
          <h1 className="text-2xl font-bold text-slate-800">Processing Dashboard</h1>
          <p className="text-sm text-slate-500 mt-2">Sign in to manage verification processing sessions.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-600 font-medium block mb-1">Username</label>
            <input
              type="text"
              autoComplete="username"
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-600 font-medium block mb-1">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
          <Button type="submit" loading={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
}
