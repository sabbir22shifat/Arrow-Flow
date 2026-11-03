'use server';

// ====================================================================
// ARROW FLOW: Authentication Server Actions
// Agency: Arrow Solutions
// ====================================================================

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { DEFAULT_STAFF_ACCOUNTS, setStaffSession, clearStaffSession } from '@/lib/auth';
import { ActionResult } from '@/types/database';

export async function loginAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const identifier = (formData.get('identifier') as string)?.trim().toLowerCase();
  const password = (formData.get('password') as string)?.trim();

  if (!identifier || !password) {
    return { success: false, error: 'Please enter both Staff ID/Email and Password.' };
  }

  // Find matching account
  const account = DEFAULT_STAFF_ACCOUNTS.find(
    (acc) =>
      acc.email.toLowerCase() === identifier ||
      acc.aliases.some((alias) => alias.toLowerCase() === identifier)
  );

  if (!account || account.password !== password) {
    return {
      success: false,
      error: 'Invalid Credentials. Use ID "admin" or "admin@arrowsolutions.com" with password "arrow2026".',
    };
  }

  // Set secure HTTP cookie
  setStaffSession({
    id: account.id,
    email: account.email,
    full_name: account.full_name,
    role: account.role,
  });

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function logoutAction() {
  clearStaffSession();
  revalidatePath('/dashboard');
  redirect('/login');
}
