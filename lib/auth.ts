// ====================================================================
// ARROW FLOW: Internal Agency Authentication & Session Management
// Agency: Arrow Solutions
// ====================================================================

import { cookies } from 'next/headers';
import { StaffRole } from '@/types/database';

export interface StaffSession {
  id: string;
  email: string;
  full_name: string;
  role: StaffRole;
  designation?: string;
}

// Built-in verified agency staff accounts
export const DEFAULT_STAFF_ACCOUNTS = [
  {
    id: 'staff-admin-01',
    email: 'admin@arrowsolutions.com',
    aliases: [
      'admin',
      'shifat@arrowsolutions.com',
      'sabbir@arrowsolutions.com',
      'ceo@arrowsolutions.com',
      'shifat',
      'sabbir',
    ],
    password: 'arrow2026',
    full_name: 'Md. Sabbir Ahammed Shifat',
    role: 'admin' as StaffRole,
    designation: 'Chief Executive Officer (CEO)',
  },
  {
    id: 'staff-manager-02',
    email: 'manager@arrowsolutions.com',
    aliases: ['manager', 'sadia@arrowsolutions.com', 'sadia'],
    password: 'arrow2026',
    full_name: 'Sadia Afrin',
    role: 'manager' as StaffRole,
    designation: 'Operations & BTL Activation Lead',
  },
  {
    id: 'staff-dev-03',
    email: 'tech@arrowsolutions.com',
    aliases: ['tech', 'mahmud@arrowsolutions.com', 'mahmud'],
    password: 'arrow2026',
    full_name: 'Mahmudul Hasan',
    role: 'admin' as StaffRole,
    designation: 'Lead Full-Stack Engineer',
  },
];

const SESSION_COOKIE_NAME = 'arrow_flow_session';

export function getStaffSession(): StaffSession | null {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }
    return JSON.parse(sessionCookie.value) as StaffSession;
  } catch {
    return null;
  }
}

export function setStaffSession(session: StaffSession) {
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 14, // 14 days
    path: '/',
  });
}

export function clearStaffSession() {
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}
