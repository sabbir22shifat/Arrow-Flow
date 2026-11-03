// ====================================================================
// ARROW FLOW: Database Entity Types & System Domain Models
// Agency: Arrow Solutions
// ====================================================================

export type LeadStatus = 'New' | 'Contacted' | 'Proposal Sent' | 'Won' | 'Lost';

export type ServiceDomain =
  | 'BTL & Activation'
  | 'Digital Marketing'
  | 'Web & IT'
  | 'Event Management';

export type InvoiceStatus = 'Unpaid' | 'Partially Paid' | 'Paid';

export type ExpenseCategory =
  | 'Office & Rent'
  | 'Marketing'
  | 'Domain & Hosting'
  | 'Operational'
  | 'Salaries'
  | 'Misc';

export type StaffRole = 'admin' | 'manager' | 'executive';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: StaffRole;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  phone?: string | null;
  email?: string | null;
  service_domain: ServiceDomain;
  status: LeadStatus;
  deal_value: number;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  contact_id: string | null;
  invoice_no: string;
  total_amount: number;
  paid_amount: number;
  status: InvoiceStatus;
  due_date: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceWithContact extends Invoice {
  contact?: Contact | null;
}

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  expense_date: string;
  receipt_url?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface Employee {
  id: string;
  full_name: string;
  designation: string;
  base_salary: number;
  joining_date: string;
  phone?: string | null;
  email?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Payroll {
  id: string;
  employee_id: string;
  month_year: string;
  bonus: number;
  deductions: number;
  net_salary: number;
  status: 'Pending' | 'Paid';
  disbursed_at?: string | null;
  created_at: string;
}

export interface PayrollWithEmployee extends Payroll {
  employee?: Employee | null;
}

export interface DashboardMetrics {
  cashCollected: number;
  outstandingDue: number;
  totalExpenses: number;
  netOperatingMargin: number;
  isProfitable: boolean;
  activeLeadsCount: number;
  totalDealsWonValue: number;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
