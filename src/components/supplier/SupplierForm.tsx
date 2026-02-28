import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle, Loader2, RotateCcw } from "lucide-react";
import FormSection from "./FormSection";
import FormField from "./FormField";
import FormSelect from "./FormSelect";
import FileUpload from "./FileUpload";
import ProgressIndicator from "./ProgressIndicator";
import SecurityNotice from "./SecurityNotice";
import { countries } from "@/lib/countries";

const entityTypes = [
  { value: "empresa", label: "Empresa" },
  { value: "eni", label: "ENI" },
  { value: "freelancer", label: "Freelancer" },
];

const vatRegimes = [
  { value: "0", label: "0%" },
  { value: "4", label: "4%" },
  { value: "6", label: "6%" },
  { value: "16", label: "16%" },
  { value: "23", label: "23%" },
];

const currencies = [
  { value: "EUR", label: "EUR" },
  { value: "USD", label: "Dólar" },
  { value: "OTHER", label: "Outro" },
];

interface FormData {
  legal_name: string;
  commercial_name: string;
  entity_type: string;
  nif_vat: string;
  country: string;
  fiscal_address: string;
  primary_contact: string;
  email: string;
  billing_email: string;
  phone: string;
  website_linkedin: string;
  service_product: string;
  vat_regime: string;
  currency: string;
  currency_other: string;
  bank_name: string;
  iban: string;
  swift: string;
}

const initialFormData: FormData = {
  legal_name: "",
  commercial_name: "",
  entity_type: "",
  nif_vat: "",
  country: "",
  fiscal_address: "",
  primary_contact: "",
  email: "",
  billing_email: "",
  phone: "",
  website_linkedin: "",
  service_product: "",
  vat_regime: "",
  currency: "",
  currency_other: "",
  bank_name: "",
  iban: "",
  swift: "",
};

const requiredFields = [
  "legal_name", "entity_type", "nif_vat", "country", "fiscal_address",
  "primary_contact", "email", "billing_email", "phone",
  "service_product", "vat_regime", "currency",
  "bank_name", "iban", "swift",
];

const SupplierForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData | "file" | "consent", string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Auto-uppercase IBAN
    const processedValue = name === "iban" ? value.toUpperCase() : name === "swift" ? value.toUpperCase() : value;
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name: keyof FormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateIBAN = (iban: string): boolean => {
    const cleaned = iban.replace(/\s/g, "");
    return /^[A-Z]{2}\d{2}[A-Z0-9]{4,30}$/.test(cleaned.toUpperCase());
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    requiredFields.forEach((field) => {
      if (!formData[field as keyof FormData]?.trim()) {
        newErrors[field as keyof FormData] = "Este campo é obrigatório.";
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido.";
    }
    if (formData.billing_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.billing_email)) {
      newErrors.billing_email = "Email inválido.";
    }
    if (formData.iban && !validateIBAN(formData.iban)) {
      newErrors.iban = "Formato de IBAN inválido.";
    }
    if (formData.currency === "OTHER" && !formData.currency_other?.trim()) {
      newErrors.currency_other = "Indique a moeda.";
    }
    if (!file) {
      newErrors.file = "É necessário anexar o comprovativo para concluir o registo.";
    }
    if (!consent) {
      newErrors.consent = "É necessário aceitar os termos para submeter.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Por favor, corrija os campos assinalados.");
      return;
    }

    setSubmitting(true);
    try {
      let ibanProofUrl: string | null = null;

      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("iban-proofs")
          .upload(fileName, file);
        if (uploadError) throw uploadError;
        ibanProofUrl = fileName;
      }

      const { error: insertError } = await supabase.from("suppliers").insert({
        legal_name: formData.legal_name.trim(),
        commercial_name: formData.commercial_name.trim() || null,
        entity_type: formData.entity_type,
        nif_vat: formData.nif_vat.trim(),
        country: formData.country,
        fiscal_address: formData.fiscal_address.trim(),
        primary_contact: formData.primary_contact.trim(),
        email: formData.email.trim(),
        billing_email: formData.billing_email.trim(),
        phone: formData.phone.trim(),
        website_linkedin: formData.website_linkedin.trim() || null,
        service_product: formData.service_product.trim(),
        vat_regime: formData.vat_regime,
        currency: formData.currency === "OTHER" ? formData.currency_other.trim() : formData.currency,
        currency_other: formData.currency === "OTHER" ? formData.currency_other.trim() : null,
        bank_name: formData.bank_name.trim(),
        iban: formData.iban.replace(/\s/g, "").toUpperCase(),
        swift: formData.swift.trim().toUpperCase(),
        iban_proof_url: ibanProofUrl,
        consent_given: true,
      });

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao submeter. Por favor, tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setFile(null);
    setConsent(false);
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="form-card max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-7 w-7 text-success" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Informação recebida</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              A nossa equipa financeira irá validar os dados e entrar em contacto caso seja necessário.
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <Button onClick={handleReset} variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Submeter novo fornecedor
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[640px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8 space-y-3">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-6">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">G</span>
          </div>
          <span className="font-semibold text-foreground">Grupo</span>
        </div>
        
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Supplier Information
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Por favor, preencha os dados abaixo para iniciarmos o processo de validação.
        </p>
        <ProgressIndicator formData={formData as unknown as { [key: string]: string }} file={file} requiredFields={requiredFields} />
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-10">
        {/* Card container */}
        <div className="form-card space-y-10">
          {/* 01 · Legal Information */}
          <FormSection
            title="01 · Informação Legal"
            helperText="Utilizado exclusivamente para efeitos legais e fiscais."
          >
            <FormField label="Nome legal do fornecedor" name="legal_name" required value={formData.legal_name} onChange={handleChange} error={errors.legal_name} />
            <FormField label="Nome comercial" name="commercial_name" value={formData.commercial_name} onChange={handleChange} />
            <FormSelect label="Tipo de entidade" name="entity_type" required value={formData.entity_type} onChange={handleSelectChange("entity_type")} options={entityTypes} error={errors.entity_type} />
            <FormField label="NIF / VAT" name="nif_vat" required value={formData.nif_vat} onChange={handleChange} error={errors.nif_vat} />
            <FormSelect label="País" name="country" required value={formData.country} onChange={handleSelectChange("country")} options={countries} error={errors.country} />
            <FormField label="Morada fiscal" name="fiscal_address" required value={formData.fiscal_address} onChange={handleChange} error={errors.fiscal_address} />
          </FormSection>

          <div className="border-t border-border" />

          {/* 02 · Contact Information */}
          <FormSection
            title="02 · Informação de Contacto"
            helperText="Usaremos estes contactos apenas para comunicação relacionada com serviços e faturação."
          >
            <FormField label="Contacto principal" name="primary_contact" required value={formData.primary_contact} onChange={handleChange} error={errors.primary_contact} />
            <FormField label="Email" name="email" type="email" required value={formData.email} onChange={handleChange} error={errors.email} />
            <FormField label="Email de faturação" name="billing_email" type="email" required value={formData.billing_email} onChange={handleChange} error={errors.billing_email} />
            <FormField label="Telefone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} error={errors.phone} />
            <FormField label="Website / LinkedIn" name="website_linkedin" value={formData.website_linkedin} onChange={handleChange} placeholder="https://" />
          </FormSection>

          <div className="border-t border-border" />

          {/* 03 · Fiscal Details */}
          <FormSection title="03 · Dados Fiscais">
            <FormField label="Serviço / Produto" name="service_product" required value={formData.service_product} onChange={handleChange} error={errors.service_product} />
            <FormSelect label="Regime de IVA" name="vat_regime" required value={formData.vat_regime} onChange={handleSelectChange("vat_regime")} options={vatRegimes} error={errors.vat_regime} />
            <FormSelect label="Moeda" name="currency" required value={formData.currency} onChange={handleSelectChange("currency")} options={currencies} error={errors.currency} />
            {formData.currency === "OTHER" && (
              <FormField label="Indique a moeda" name="currency_other" required value={formData.currency_other} onChange={handleChange} error={errors.currency_other} />
            )}
          </FormSection>

          <div className="border-t border-border" />

          {/* 04 · Banking Information */}
          <FormSection title="04 · Dados Bancários">
            <SecurityNotice />
            <FormField label="Banco" name="bank_name" required value={formData.bank_name} onChange={handleChange} error={errors.bank_name} />
            <FormField label="IBAN" name="iban" required value={formData.iban} onChange={handleChange} error={errors.iban} placeholder="PT50 0000 0000 0000 0000 0000 0" />
            <FormField label="SWIFT / BIC" name="swift" required value={formData.swift} onChange={handleChange} error={errors.swift} />
            <FileUpload
              label="Comprovativo de IBAN"
              name="iban_proof"
              required
              file={file}
              onFileChange={(f) => {
                setFile(f);
                if (errors.file) setErrors((prev) => ({ ...prev, file: undefined }));
              }}
              error={errors.file}
            />
          </FormSection>
        </div>

        {/* Sticky Submit Bar */}
        <div className="sticky bottom-0 bg-card border border-border rounded-xl p-6 space-y-4" style={{ boxShadow: "0 -4px 20px hsl(var(--foreground) / 0.06)" }}>
          <div className="flex items-start gap-3">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => {
                setConsent(checked === true);
                if (errors.consent) setErrors((prev) => ({ ...prev, consent: undefined }));
              }}
              className="mt-0.5"
            />
            <Label htmlFor="consent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
              Declaro que as informações fornecidas são verdadeiras e autorizo o tratamento dos dados para efeitos de gestão contratual e faturação, nos termos legais aplicáveis.
            </Label>
          </div>
          {errors.consent && <p className="text-xs text-destructive">{errors.consent}</p>}

          <div className="flex justify-end">
            <Button type="submit" disabled={submitting} size="lg" className="h-12 px-8 rounded-lg text-sm font-semibold bg-primary hover:bg-primary-hover text-primary-foreground">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  A submeter...
                </>
              ) : (
                "Submeter dados"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SupplierForm;
