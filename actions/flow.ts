'use server';

// ====================================================================
// ARROW FLOW: Server Actions & Data Mutation Handlers (Neon Tech & Fallback)
// Agency: Arrow Solutions
// ====================================================================

import { revalidatePath } from 'next/cache';
import { getNeonSql, isNeonConfigured } from '@/lib/neon/db';
import { createClient } from '@/lib/supabase/server';
import {
  isSupabaseConfigured,
  addFallbackLead,
  updateFallbackLeadStatus,
  addFallbackInvoice,
  recordFallbackPayment,
  addFallbackExpense,
} from '@/lib/data';
import {
  LeadStatus,
  ServiceDomain,
  ExpenseCategory,
  ActionResult,
  Contact,
  Invoice,
  Expense,
} from '@/types/database';

/**
 * 1. CREATE LEAD
 * Validates and inserts a new lead into `contacts`.
 */
export async function createLead(formData: FormData): Promise<ActionResult<Contact>> {
  try {
    const name = (formData.get('name') as string)?.trim();
    const company = (formData.get('company') as string)?.trim();
    const phone = (formData.get('phone') as string)?.trim() || null;
    const email = (formData.get('email') as string)?.trim() || null;
    const service_domain = (formData.get('service_domain') as ServiceDomain) || 'BTL & Activation';
    const status = (formData.get('status') as LeadStatus) || 'New';
    const dealValueRaw = formData.get('deal_value');
    const deal_value = dealValueRaw ? parseFloat(dealValueRaw.toString()) : 0;
    const notes = (formData.get('notes') as string)?.trim() || null;

    if (!name || !company) {
      return { success: false, error: 'Both Contact Name and Company are required.' };
    }

    // A. Neon Tech Serverless Postgres
    const sql = getNeonSql();
    if (sql) {
      const rows = await sql`
        INSERT INTO contacts (name, company, phone, email, service_domain, status, deal_value, notes)
        VALUES (
          ${name},
          ${company},
          ${phone},
          ${email},
          ${service_domain},
          ${status},
          ${isNaN(deal_value) ? 0 : deal_value},
          ${notes}
        )
        RETURNING *;
      `;
      revalidatePath('/dashboard');
      revalidatePath('/dashboard/leads');
      revalidatePath('/dashboard/pipeline');
      return { success: true, message: 'Lead added to Neon PostgreSQL database', data: rows[0] as Contact };
    }

    // B. Supabase (if configured)
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('contacts')
        .insert([
          {
            name,
            company,
            phone,
            email,
            service_domain,
            status,
            deal_value: isNaN(deal_value) ? 0 : deal_value,
            notes,
          },
        ])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      revalidatePath('/dashboard');
      revalidatePath('/dashboard/leads');
      revalidatePath('/dashboard/pipeline');
      return { success: true, message: 'Lead added successfully', data: data as Contact };
    }

    // C. Zero-config fallback store
    const newLead = addFallbackLead({
      name,
      company,
      phone,
      email,
      service_domain,
      status,
      deal_value: isNaN(deal_value) ? 0 : deal_value,
      notes,
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/leads');
    revalidatePath('/dashboard/pipeline');
    return { success: true, message: 'Lead created successfully', data: newLead };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to create lead.';
    return { success: false, error: errorMsg };
  }
}

/**
 * 2. UPDATE LEAD STATUS
 * Handles instant status updates across the sales pipeline (Kanban / Table).
 */
export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<ActionResult<{ id: string; status: LeadStatus }>> {
  try {
    if (!id || !status) {
      return { success: false, error: 'Lead ID and Target Status are required.' };
    }

    // A. Neon Tech Serverless Postgres
    const sql = getNeonSql();
    if (sql) {
      await sql`
        UPDATE contacts
        SET status = ${status}, updated_at = NOW()
        WHERE id = ${id};
      `;
      revalidatePath('/dashboard');
      revalidatePath('/dashboard/leads');
      revalidatePath('/dashboard/pipeline');
      return { success: true, message: `Lead moved to ${status} in Neon Postgres`, data: { id, status } };
    }

    // B. Supabase
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { error } = await supabase
        .from('contacts')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      revalidatePath('/dashboard');
      revalidatePath('/dashboard/leads');
      revalidatePath('/dashboard/pipeline');
      return { success: true, message: `Lead moved to ${status}`, data: { id, status } };
    }

    // C. Fallback
    updateFallbackLeadStatus(id, status);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/leads');
    revalidatePath('/dashboard/pipeline');
    return { success: true, message: `Lead moved to ${status}`, data: { id, status } };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to update lead status.';
    return { success: false, error: errorMsg };
  }
}

/**
 * 3. CREATE INVOICE
 * Generates an invoice with auto-calculated due balance and status.
 */
export async function createInvoice(formData: FormData): Promise<ActionResult<Invoice>> {
  try {
    const contact_id = (formData.get('contact_id') as string) || null;
    let invoice_no = (formData.get('invoice_no') as string)?.trim();
    const totalRaw = formData.get('total_amount');
    const paidRaw = formData.get('paid_amount');
    const due_date = (formData.get('due_date') as string) || new Date().toISOString().split('T')[0];
    const notes = (formData.get('notes') as string)?.trim() || null;

    const total_amount = totalRaw ? Math.max(0, parseFloat(totalRaw.toString())) : 0;
    const paid_amount = paidRaw ? Math.max(0, parseFloat(paidRaw.toString())) : 0;

    if (!total_amount || total_amount <= 0) {
      return { success: false, error: 'Total amount must be greater than 0.' };
    }

    if (!invoice_no) {
      const yr = new Date().getFullYear();
      const randomSeq = Math.floor(100 + Math.random() * 900);
      invoice_no = `INV-${yr}-${randomSeq}`;
    }

    let status: 'Unpaid' | 'Partially Paid' | 'Paid' = 'Unpaid';
    if (paid_amount >= total_amount) {
      status = 'Paid';
    } else if (paid_amount > 0) {
      status = 'Partially Paid';
    }

    // A. Neon Tech Serverless Postgres
    const sql = getNeonSql();
    if (sql) {
      const rows = await sql`
        INSERT INTO invoices (contact_id, invoice_no, total_amount, paid_amount, status, due_date, notes)
        VALUES (
          ${contact_id && contact_id !== '' ? contact_id : null},
          ${invoice_no},
          ${total_amount},
          ${Math.min(paid_amount, total_amount)},
          ${status},
          ${due_date},
          ${notes}
        )
        RETURNING *;
      `;
      revalidatePath('/dashboard');
      revalidatePath('/dashboard/invoices');
      return { success: true, message: `Invoice ${invoice_no} generated in Neon Postgres`, data: rows[0] as Invoice };
    }

    // B. Supabase
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('invoices')
        .insert([
          {
            contact_id: contact_id && contact_id !== '' ? contact_id : null,
            invoice_no,
            total_amount,
            paid_amount: Math.min(paid_amount, total_amount),
            status,
            due_date,
            notes,
          },
        ])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      revalidatePath('/dashboard');
      revalidatePath('/dashboard/invoices');
      return { success: true, message: `Invoice ${invoice_no} generated`, data: data as Invoice };
    }

    // C. Fallback
    const newInvoice = addFallbackInvoice({
      contact_id: contact_id && contact_id !== '' ? contact_id : null,
      invoice_no,
      total_amount,
      paid_amount: Math.min(paid_amount, total_amount),
      status,
      due_date,
      notes,
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/invoices');
    return { success: true, message: `Invoice ${invoice_no} generated`, data: newInvoice };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to generate invoice.';
    return { success: false, error: errorMsg };
  }
}

/**
 * 4. RECORD PAYMENT
 * Updates paid amounts and recalculates status ('Paid' vs 'Partially Paid').
 */
export async function recordPayment(
  invoiceId: string,
  amount: number
): Promise<ActionResult<{ invoiceId: string; newPaid: number; status: string }>> {
  try {
    if (!invoiceId || amount <= 0) {
      return { success: false, error: 'Valid invoice ID and payment amount are required.' };
    }

    // A. Neon Tech Serverless Postgres
    const sql = getNeonSql();
    if (sql) {
      const rows = await sql`
        SELECT total_amount, paid_amount FROM invoices WHERE id = ${invoiceId};
      `;
      if (!rows || rows.length === 0) {
        return { success: false, error: 'Invoice not found in Neon database.' };
      }
      const inv = rows[0];
      const total = Number(inv.total_amount);
      const currentPaid = Number(inv.paid_amount || 0);
      const newPaid = Math.min(total, currentPaid + amount);

      let newStatus: 'Unpaid' | 'Partially Paid' | 'Paid' = 'Unpaid';
      if (newPaid >= total) {
        newStatus = 'Paid';
      } else if (newPaid > 0) {
        newStatus = 'Partially Paid';
      }

      await sql`
        UPDATE invoices
        SET paid_amount = ${newPaid}, status = ${newStatus}, updated_at = NOW()
        WHERE id = ${invoiceId};
      `;

      revalidatePath('/dashboard');
      revalidatePath('/dashboard/invoices');
      return {
        success: true,
        message: `Payment of ৳${amount.toLocaleString()} recorded in Neon Postgres`,
        data: { invoiceId, newPaid, status: newStatus },
      };
    }

    // B. Supabase
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data: inv, error: fetchErr } = await supabase
        .from('invoices')
        .select('total_amount, paid_amount')
        .eq('id', invoiceId)
        .single();

      if (fetchErr || !inv) {
        return { success: false, error: 'Invoice not found.' };
      }

      const total = Number(inv.total_amount);
      const currentPaid = Number(inv.paid_amount || 0);
      const newPaid = Math.min(total, currentPaid + amount);

      let newStatus: 'Unpaid' | 'Partially Paid' | 'Paid' = 'Unpaid';
      if (newPaid >= total) {
        newStatus = 'Paid';
      } else if (newPaid > 0) {
        newStatus = 'Partially Paid';
      }

      const { error: updateErr } = await supabase
        .from('invoices')
        .update({
          paid_amount: newPaid,
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', invoiceId);

      if (updateErr) {
        return { success: false, error: updateErr.message };
      }

      revalidatePath('/dashboard');
      revalidatePath('/dashboard/invoices');
      return {
        success: true,
        message: `Payment of ৳${amount.toLocaleString()} recorded successfully`,
        data: { invoiceId, newPaid, status: newStatus },
      };
    }

    // C. Fallback
    const updated = recordFallbackPayment(invoiceId, amount);
    if (!updated) {
      return { success: false, error: 'Invoice not found in records.' };
    }

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/invoices');
    return {
      success: true,
      message: `Payment of ৳${amount.toLocaleString()} recorded`,
      data: { invoiceId, newPaid: updated.paid_amount, status: updated.status },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to record payment.';
    return { success: false, error: errorMsg };
  }
}

/**
 * 5. CREATE EXPENSE
 * Logs operational & agency overhead expenses.
 */
export async function createExpense(formData: FormData): Promise<ActionResult<Expense>> {
  try {
    const title = (formData.get('title') as string)?.trim();
    const category = (formData.get('category') as ExpenseCategory) || 'Operational';
    const amountRaw = formData.get('amount');
    const expense_date =
      (formData.get('expense_date') as string) || new Date().toISOString().split('T')[0];
    const notes = (formData.get('notes') as string)?.trim() || null;

    const amount = amountRaw ? parseFloat(amountRaw.toString()) : 0;

    if (!title || !amount || amount <= 0) {
      return { success: false, error: 'Expense title and a valid amount are required.' };
    }

    // A. Neon Tech Serverless Postgres
    const sql = getNeonSql();
    if (sql) {
      const rows = await sql`
        INSERT INTO expenses (title, category, amount, expense_date, notes)
        VALUES (${title}, ${category}, ${amount}, ${expense_date}, ${notes})
        RETURNING *;
      `;
      revalidatePath('/dashboard');
      revalidatePath('/dashboard/expenses');
      return { success: true, message: 'Expense logged to Neon Postgres', data: rows[0] as Expense };
    }

    // B. Supabase
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('expenses')
        .insert([
          {
            title,
            category,
            amount,
            expense_date,
            notes,
          },
        ])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      revalidatePath('/dashboard');
      revalidatePath('/dashboard/expenses');
      return { success: true, message: 'Expense logged successfully', data: data as Expense };
    }

    // C. Fallback
    const newExpense = addFallbackExpense({
      title,
      category,
      amount,
      expense_date,
      notes,
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/expenses');
    return { success: true, message: 'Expense logged successfully', data: newExpense };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to log expense.';
    return { success: false, error: errorMsg };
  }
}
