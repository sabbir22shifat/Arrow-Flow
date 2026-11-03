import { isNeonConfigured } from '@/lib/neon/db';
import { isSupabaseConfigured, getActiveDatabaseProvider } from '@/lib/data';
import {
  Settings,
  Database,
  ShieldCheck,
  Server,
  Key,
  Globe,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

export default function SettingsPage() {
  const neonActive = isNeonConfigured();
  const supabaseActive = isSupabaseConfigured();
  const provider = getActiveDatabaseProvider();

  const rawUrl = process.env.DATABASE_URL || process.env.DATABASE_URL_POOLED || '';
  const maskedHost = rawUrl ? rawUrl.replace(/\/\/.*@/, '//@') : 'Not yet configured';

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-2 border-b border-slate-800/60">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          System & Agency Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure Neon Tech Serverless Postgres database and Agency Profile
        </p>
      </div>

      {/* Neon Tech PostgreSQL Connection Status Card */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">Neon Tech Serverless PostgreSQL</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Primary DB
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Direct connection via @neondatabase/serverless driver
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              neonActive
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
            }`}
          >
            {neonActive ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Neon Connected</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Paste .env To Connect</span>
              </>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-2.5 text-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Active Storage Provider:</span>
            <span className="font-semibold text-emerald-400 uppercase tracking-wider">
              {provider === 'neon'
                ? 'Neon Tech Serverless Postgres'
                : provider === 'supabase'
                ? 'Supabase'
                : 'Zero-Config Preview (Local Cache)'}
            </span>
          </div>

          <div className="pt-2 text-[11px] font-mono text-slate-400 space-y-1 border-t border-slate-800/80">
            <p>
              DATABASE_URL:{' '}
              <span className="text-slate-200">{maskedHost}</span>
            </p>
            <p>
              DRIVER:{' '}
              <span className="text-emerald-400">@neondatabase/serverless (HTTP / WebSocket)</span>
            </p>
          </div>
        </div>

        {/* Quick Instructions */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs space-y-2">
          <span className="font-semibold text-white">How to run migration on Neon Console:</span>
          <ol className="list-decimal list-inside space-y-1 text-slate-400 leading-relaxed">
            <li>
              Go to{' '}
              <a
                href="https://console.neon.tech"
                target="_blank"
                rel="noreferrer"
                className="text-sky-400 underline hover:text-sky-300 inline-flex items-center gap-0.5"
              >
                console.neon.tech <ExternalLink className="w-3 h-3" />
              </a>{' '}
              and click on your <strong>Arrow Flow</strong> project.
            </li>
            <li>In the left sidebar, click <strong>SQL Editor</strong>.</li>
            <li>Copy and paste all code from <code className="text-slate-200">neon/schema.sql</code> and click <strong>Run</strong>.</li>
            <li>Click <strong>Copy .env</strong> on the welcome screen and paste the <code className="text-slate-200">DATABASE_URL</code> into your <code className="text-slate-200">.env.local</code>.</li>
          </ol>
        </div>
      </div>

      {/* Agency Identity Card */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Agency Organization Identity</h2>
            <p className="text-xs text-slate-400">Arrow Solutions Operational Metadata</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-slate-400">Official Registered Name:</span>
            <p className="font-semibold text-slate-200 mt-1">Arrow Solutions</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-slate-400">Service Domains:</span>
            <p className="font-semibold text-slate-200 mt-1">
              BTL & Activation, Digital Marketing, Web & IT, Event Management
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-slate-400">Default Currency:</span>
            <p className="font-semibold text-slate-200 mt-1">Bangladeshi Taka (BDT ৳)</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-slate-400">Operating Headquarters:</span>
            <p className="font-semibold text-slate-200 mt-1">Gulshan-2, Dhaka, Bangladesh</p>
          </div>
        </div>
      </div>
    </div>
  );
}
