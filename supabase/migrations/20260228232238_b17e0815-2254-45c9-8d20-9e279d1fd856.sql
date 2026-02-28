
-- Create suppliers table for form submissions (public, no auth required)
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Legal Information
  legal_name TEXT NOT NULL,
  commercial_name TEXT,
  entity_type TEXT NOT NULL,
  nif_vat TEXT NOT NULL,
  country TEXT NOT NULL,
  fiscal_address TEXT NOT NULL,
  -- Contact Information
  primary_contact TEXT NOT NULL,
  email TEXT NOT NULL,
  billing_email TEXT NOT NULL,
  phone TEXT NOT NULL,
  website_linkedin TEXT,
  -- Fiscal Details
  service_product TEXT NOT NULL,
  vat_regime TEXT NOT NULL,
  currency TEXT NOT NULL,
  currency_other TEXT,
  -- Banking Information
  bank_name TEXT NOT NULL,
  iban TEXT NOT NULL,
  swift TEXT NOT NULL,
  iban_proof_url TEXT,
  -- Consent
  consent_given BOOLEAN NOT NULL DEFAULT false,
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public form)
CREATE POLICY "Anyone can submit supplier data"
  ON public.suppliers FOR INSERT
  WITH CHECK (true);

-- Create storage bucket for IBAN proofs
INSERT INTO storage.buckets (id, name, public) VALUES ('iban-proofs', 'iban-proofs', false);

-- Allow anonymous uploads to iban-proofs bucket
CREATE POLICY "Anyone can upload IBAN proof"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'iban-proofs');

-- Allow reading IBAN proofs (for internal team)
CREATE POLICY "Authenticated users can view IBAN proofs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'iban-proofs');
