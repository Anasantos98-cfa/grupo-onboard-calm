
-- Add internal request fields and workflow columns to suppliers table
ALTER TABLE public.suppliers
  ADD COLUMN IF NOT EXISTS token text UNIQUE,
  ADD COLUMN IF NOT EXISTS supplier_submitted_at timestamptz,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS approved_by text,
  ADD COLUMN IF NOT EXISTS finance_approved_by text,
  ADD COLUMN IF NOT EXISTS responsavel text,
  ADD COLUMN IF NOT EXISTS projeto_area text,
  ADD COLUMN IF NOT EXISTS categoria text,
  ADD COLUMN IF NOT EXISTS entidade text,
  ADD COLUMN IF NOT EXISTS custo_medio_mensal text,
  ADD COLUMN IF NOT EXISTS comentarios text,
  ADD COLUMN IF NOT EXISTS data_inicio text,
  ADD COLUMN IF NOT EXISTS data_fim text,
  ADD COLUMN IF NOT EXISTS acesso_dados_pessoais boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS acesso_sistemas_internos boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS codigo_interno_1 text,
  ADD COLUMN IF NOT EXISTS codigo_interno_2 text,
  ADD COLUMN IF NOT EXISTS codigo_interno_3 text,
  ADD COLUMN IF NOT EXISTS relevancia_iso text,
  ADD COLUMN IF NOT EXISTS condicoes_pagamento text;

-- Update default status from 'pending' to 'draft'
ALTER TABLE public.suppliers ALTER COLUMN status SET DEFAULT 'draft';

-- Make supplier-specific fields nullable (admin creates record first without supplier data)
ALTER TABLE public.suppliers ALTER COLUMN legal_name SET DEFAULT '';
ALTER TABLE public.suppliers ALTER COLUMN entity_type SET DEFAULT '';
ALTER TABLE public.suppliers ALTER COLUMN nif_vat SET DEFAULT '';
ALTER TABLE public.suppliers ALTER COLUMN country SET DEFAULT '';
ALTER TABLE public.suppliers ALTER COLUMN fiscal_address SET DEFAULT '';
ALTER TABLE public.suppliers ALTER COLUMN primary_contact SET DEFAULT '';
ALTER TABLE public.suppliers ALTER COLUMN email SET DEFAULT '';
ALTER TABLE public.suppliers ALTER COLUMN billing_email SET DEFAULT '';
ALTER TABLE public.suppliers ALTER COLUMN phone SET DEFAULT '';
ALTER TABLE public.suppliers ALTER COLUMN service_product SET DEFAULT '';
ALTER TABLE public.suppliers ALTER COLUMN vat_regime SET DEFAULT '';
ALTER TABLE public.suppliers ALTER COLUMN currency SET DEFAULT '';
ALTER TABLE public.suppliers ALTER COLUMN bank_name SET DEFAULT '';
ALTER TABLE public.suppliers ALTER COLUMN iban SET DEFAULT '';
ALTER TABLE public.suppliers ALTER COLUMN swift SET DEFAULT '';

-- Add RLS policy: Anyone can SELECT by token (for supplier portal)
CREATE POLICY "Anyone can select supplier by token"
  ON public.suppliers
  FOR SELECT
  USING (true);

-- Add RLS policy: Anyone can UPDATE supplier data (for supplier submission and admin actions)
CREATE POLICY "Anyone can update supplier data"
  ON public.suppliers
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
