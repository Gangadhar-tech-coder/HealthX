import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HeartPulse, Key, Mail, User, ArrowRight, Lock } from 'lucide-react'
import { login, register } from '../api/assistant'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  // Redirect target after successful login
  const from = (location.state as any)?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const data = await login(username, password)
        localStorage.setItem('token', data.token)
        localStorage.setItem('username', data.username)
        // Navigate to the target page or home
        navigate(from === '/' ? '/assistant' : from, { replace: true })
      } else {
        const data = await register(username, email, password)
        localStorage.setItem('token', data.token)
        localStorage.setItem('username', data.username)
        navigate('/assistant', { replace: true })
      }
      // Force page refresh or navbar state updates
      window.dispatchEvent(new Event('auth-change'))
    } catch (err: any) {
      console.error(err)
      const errorMsg =
        err.response?.data?.error || err.response?.data?.non_field_errors?.[0] || 'Authentication failed.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-lightest/40 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden"
      >
        {/* Background glow graphics */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-secondary/5 blur-2xl pointer-events-none" />

        {/* Logo and Header */}
        <div className="text-center relative z-10">
          <div className="mx-auto bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center text-primary mb-4">
            <HeartPulse className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-extrabold text-dark tracking-tight">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {isLogin ? 'Sign in to access your HealthX AI portal' : 'Get started with clinical wellness tracking'}
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-sm font-medium"
          >
            {error}
          </motion.div>
        )}

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5 relative z-10">
          <div className="space-y-4">
            {/* Username Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <User className="w-5 h-5" />
                </span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="health_user"
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                />
              </div>
            </div>

            {/* Email Input (only for register) */}
            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@healthx.com"
                    className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                  />
                </div>
              </div>
            )}

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary text-white text-sm font-semibold rounded-xl py-3.5 hover:bg-primary-dark flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 disabled:bg-gray-400 disabled:shadow-none transition-all duration-300 cursor-pointer mt-6"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* Toggle Switch */}
        <div className="text-center relative z-10 mt-6 pt-6 border-t border-gray-100 text-sm">
          <span className="text-gray-500">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
          </span>
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
            }}
            className="font-bold text-primary hover:underline hover:text-primary-dark transition-colors cursor-pointer"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
