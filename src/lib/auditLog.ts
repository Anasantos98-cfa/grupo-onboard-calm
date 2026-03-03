import { supabase } from "@/integrations/supabase/client";

interface AuditLogEntry {
  supplier_id: string;
  action: string;
  performed_by?: string;
  previous_status?: string | null;
  new_status?: string | null;
  metadata?: Record<string, unknown> | null;
}

export const createAuditLog = async (entry: AuditLogEntry) => {
  const { error } = await (supabase.from("supplier_audit_logs") as any).insert({
    supplier_id: entry.supplier_id,
    action: entry.action,
    performed_by: entry.performed_by || "Sistema",
    previous_status: entry.previous_status || null,
    new_status: entry.new_status || null,
    metadata: entry.metadata || null,
  });
  if (error) console.error("Audit log error:", error);
};
