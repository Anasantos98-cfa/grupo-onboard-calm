
-- Create immutable audit log table
CREATE TABLE public.supplier_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  action text NOT NULL,
  performed_by text,
  previous_status text,
  new_status text,
  metadata jsonb,
  timestamp timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.supplier_audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (no auth yet)
CREATE POLICY "Anyone can insert audit logs"
  ON public.supplier_audit_logs
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to select audit logs
CREATE POLICY "Anyone can select audit logs"
  ON public.supplier_audit_logs
  FOR SELECT
  USING (true);

-- NO update or delete policies = append-only by design
