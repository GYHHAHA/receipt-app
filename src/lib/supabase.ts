import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ReceiptRow {
  id: number;
  receipt_time: string;
  vendor_name: string;
  receipt_no: string;
  subtotal: number;
  gst_hst: number;
  pst_qst: number;
  tax: number;
  total: number;
  status: string;
  payment: string;
  chart_of_acct: string;
  image_url: string | null;
  created_at: string;
}

export async function fetchAllReceipts(): Promise<ReceiptRow[]> {
  const { data, error } = await supabase
    .from("receipts")
    .select("*")
    .order("receipt_time", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function updateReceiptFields(
  ids: number[],
  fields: Partial<Pick<ReceiptRow, "status" | "payment" | "chart_of_acct" | "vendor_name" | "receipt_no" | "subtotal" | "gst_hst" | "pst_qst" | "tax" | "total">>
): Promise<void> {
  const { error } = await supabase
    .from("receipts")
    .update(fields)
    .in("id", ids);

  if (error) throw error;
}

export async function insertReceipt(
  receipt: Omit<ReceiptRow, "id" | "created_at">
): Promise<ReceiptRow> {
  const { data, error } = await supabase
    .from("receipts")
    .insert(receipt)
    .select()
    .single();

  if (error) throw error;
  return data;
}
