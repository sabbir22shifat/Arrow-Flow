'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { loginAction } from '@/actions/auth';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  Database,
} from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition-all duration-200 disabled:opacity-50"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Authenticating...</span>
        </>
      ) : (
        <>
          <span>Sign In to Arrow OS</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, null);
  const [identifier, setIdentifier] = useState('admin@arrowsolutions.com');
  const [password, setPassword] = useState('arrow2026');
  const [showPassword, setShowPassword] = useState(false);

  function autoFillAdmin() {
    setIdentifier('admin@arrowsolutions.com');
    setPassword('arrow2026');
  }

  function autoFillManager() {
    setIdentifier('manager@arrowsolutions.com');
    setPassword('arrow2026');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden text-slate-100 selection:bg-sky-500/30 selection:text-sky-200">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-blue-700/15 via-sky-600/10 to-indigo-700/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-2">
            <BrandLogo size="lg" showTagline={false} />
            <div className="pt-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                Staff & Admin Portal
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Arrow Solutions Internal Agency Operating System
              </p>
            </div>
          </div>

          {/* Error Message */}
          {state?.error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <span>{state.error}</span>
            </div>
          )}

          {/* Form */}
          <form action={formAction} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Staff ID or Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  placeholder="admin@arrowsolutions.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <span className="text-[10px] text-slate-400">Default: arrow2026</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <SubmitButton />
            </div>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block text-center">
              Quick 1-Click Fill Credentials:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={autoFillAdmin}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 text-left transition-colors group"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Role</span>
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  admin@arrowsolutions.com
                </p>
              </button>

              <button
                type="button"
                onClick={autoFillManager}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-left transition-colors group"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Manager Role</span>
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  manager@arrowsolutions.com
                </p>
              </button>
            </div>
          </div>

          {/* Database Footer Status */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Neon Serverless PostgreSQL Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
