import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle, Loader2, RotateCcw, ShieldCheck, XCircle, Clock } from "lucide-react";
import FormSection from "./FormSection";
import FormField from "./FormField";
import FormSelect from "./FormSelect";
import FileUpload from "./FileUpload";
import ProgressIndicator from "./ProgressIndicator";
import SecurityNotice from "./SecurityNotice";
import AdminCreateFields from "./AdminCreateFields";
import BackofficeFields from "./BackofficeFields";
import SupplierReadOnly from "./SupplierReadOnly";
import { countries } from "@/lib/countries";

type FormMode = "admin-create" | "supplier" | "admin-review";

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

// Supplier fields
interface SupplierData {
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

// Admin internal request fields
interface AdminData {
  responsavel: string;
  projeto_area: string;
  categoria: string;
  entidade: string;
  custo_medio_mensal: string;
  comentarios: string;
  data_inicio: string;
  data_fim: string;
}

// Backoffice fields
interface BackofficeData {
  acesso_dados_pessoais: boolean;
  acesso_sistemas_internos: boolean;
  aprovado_por: string;
  aprovado_por_finance: string;
  codigo_interno_1: string;
  codigo_interno_2: string;
  codigo_interno_3: string;
  relevancia_iso: string;
  condicoes_pagamento: string;
}

const initialSupplierData: SupplierData = {
  legal_name: "", commercial_name: "", entity_type: "", nif_vat: "", country: "",
  fiscal_address: "", primary_contact: "", email: "", billing_email: "", phone: "",
  website_linkedin: "", service_product: "", vat_regime: "", currency: "", currency_other: "",
  bank_name: "", iban: "", swift: "",
};

const initialAdminData: AdminData = {
  responsavel: "", projeto_area: "", categoria: "", entidade: "",
  custo_medio_mensal: "", comentarios: "", data_inicio: "", data_fim: "",
};

const initialBackofficeData: BackofficeData = {
  acesso_dados_pessoais: false, acesso_sistemas_internos: false,
  aprovado_por: "", aprovado_por_finance: "",
  codigo_interno_1: "", codigo_interno_2: "", codigo_interno_3: "",
  relevancia_iso: "", condicoes_pagamento: "",
};

const supplierRequiredFields = [
  "legal_name", "entity_type", "nif_vat", "country", "fiscal_address",
  "primary_contact", "email", "billing_email", "phone",
  "service_product", "vat_regime", "currency", "bank_name", "iban", "swift",
];

const adminRequiredFields = ["responsavel", "projeto_area", "categoria", "entidade", "data_inicio"];

interface SupplierFormWrapperProps {
  mode: FormMode;
  /** Mock supplier data for admin-review mode */
  reviewData?: SupplierData;
  /** Mock admin data for admin-review mode */
  reviewAdminData?: AdminData;
}

const SupplierFormWrapper = ({ mode, reviewData, reviewAdminData }: SupplierFormWrapperProps) => {
  const [supplierData, setSupplierData] = useState<SupplierData>(initialSupplierData);
  const [adminData, setAdminData] = useState<AdminData>(initialAdminData);
  const [backofficeData, setBackofficeData] = useState<BackofficeData>(initialBackofficeData);
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSupplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const processed = name === "iban" || name === "swift" ? value.toUpperCase() : value;
    setSupplierData((prev) => ({ ...prev, [name]: processed }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleBackofficeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBackofficeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    if (name in supplierData) {
      setSupplierData((prev) => ({ ...prev, [name]: value }));
    } else if (name in adminData) {
      setAdminData((prev) => ({ ...prev, [name]: value }));
    } else {
      setBackofficeData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleCheckboxChange = (name: string) => (checked: boolean) => {
    setBackofficeData((prev) => ({ ...prev, [name]: checked }));
  };

  const validateIBAN = (iban: string): boolean => {
    const cleaned = iban.replace(/\s/g, "");
    return /^[A-Z]{2}\d{2}[A-Z0-9]{4,30}$/.test(cleaned.toUpperCase());
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string | undefined> = {};

    if (mode === "admin-create") {
      adminRequiredFields.forEach((field) => {
        if (!(adminData as any)[field]?.trim()) {
          newErrors[field] = "Este campo é obrigatório.";
        }
      });
    }

    if (mode === "supplier") {
      supplierRequiredFields.forEach((field) => {
        if (!(supplierData as any)[field]?.trim()) {
          newErrors[field] = "Este campo é obrigatório.";
        }
      });
      if (supplierData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supplierData.email)) {
        newErrors.email = "Email inválido.";
      }
      if (supplierData.billing_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supplierData.billing_email)) {
        newErrors.billing_email = "Email inválido.";
      }
      if (supplierData.iban && !validateIBAN(supplierData.iban)) {
        newErrors.iban = "Formato de IBAN inválido.";
      }
      if (supplierData.currency === "OTHER" && !supplierData.currency_other?.trim()) {
        newErrors.currency_other = "Indique a moeda.";
      }
      if (!file) {
        newErrors.file = "É necessário anexar o comprovativo para concluir o registo.";
      }
      if (!consent) {
        newErrors.consent = "É necessário aceitar os termos para submeter.";
      }
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
      if (mode === "admin-create") {
        // For now, just show success — no backend logic yet
        toast.success("Pedido criado com sucesso!");
        setSubmitted(true);
      } else if (mode === "supplier") {
        let ibanProofUrl: string | null = null;
        if (file) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${crypto.randomUUID()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage.from("iban-proofs").upload(fileName, file);
          if (uploadError) throw uploadError;
          ibanProofUrl = fileName;
        }

        const { error: insertError } = await supabase.from("suppliers").insert({
          legal_name: supplierData.legal_name.trim(),
          commercial_name: supplierData.commercial_name.trim() || null,
          entity_type: supplierData.entity_type,
          nif_vat: supplierData.nif_vat.trim(),
          country: supplierData.country,
          fiscal_address: supplierData.fiscal_address.trim(),
          primary_contact: supplierData.primary_contact.trim(),
          email: supplierData.email.trim(),
          billing_email: supplierData.billing_email.trim(),
          phone: supplierData.phone.trim(),
          website_linkedin: supplierData.website_linkedin.trim() || null,
          service_product: supplierData.service_product.trim(),
          vat_regime: supplierData.vat_regime,
          currency: supplierData.currency === "OTHER" ? supplierData.currency_other.trim() : supplierData.currency,
          currency_other: supplierData.currency === "OTHER" ? supplierData.currency_other.trim() : null,
          bank_name: supplierData.bank_name.trim(),
          iban: supplierData.iban.replace(/\s/g, "").toUpperCase(),
          swift: supplierData.swift.trim().toUpperCase(),
          iban_proof_url: ibanProofUrl,
          consent_given: true,
        });
        if (insertError) throw insertError;
        setSubmitted(true);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao submeter. Por favor, tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSupplierData(initialSupplierData);
    setAdminData(initialAdminData);
    setBackofficeData(initialBackofficeData);
    setFile(null);
    setConsent(false);
    setErrors({});
    setSubmitted(false);
  };

  // ——— Success screen ———
  if (submitted) {
    const successTitle = mode === "admin-create" ? "Pedido criado" : "Informação recebida";
    const successText = mode === "admin-create"
      ? "O pedido foi registado. O link será gerado para envio ao fornecedor."
      : "A nossa equipa financeira irá validar os dados e entrar em contacto caso seja necessário.";

    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="form-card max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-7 w-7 text-success" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">{successTitle}</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">{successText}</p>
          </div>
          <Button onClick={handleReset} variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            {mode === "admin-create" ? "Criar novo pedido" : "Submeter novo fornecedor"}
          </Button>
        </div>
      </div>
    );
  }

  // ——— Admin Review Mode ———
  if (mode === "admin-review") {
    const displayAdminData = reviewAdminData || initialAdminData;
    const displaySupplierData = reviewData || initialSupplierData;

    return (
      <div className="w-full max-w-[640px] mx-auto animate-fade-in">
        <div className="mb-8 space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Revisão de Fornecedor</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Reveja a informação submetida e preencha os campos de backoffice.
          </p>
        </div>

        <div className="form-card space-y-10">
          {/* Internal request — read only */}
          <AdminCreateFields
            formData={displayAdminData}
            onChange={() => {}}
            onSelectChange={() => () => {}}
            errors={{}}
            readOnly
          />

          <div className="border-t border-border" />

          {/* Supplier data — read only */}
          <SupplierReadOnly data={displaySupplierData} />

          <div className="border-t border-border" />

          {/* Backoffice — editable */}
          <BackofficeFields
            formData={backofficeData}
            onChange={handleBackofficeChange}
            onSelectChange={handleSelectChange}
            onCheckboxChange={handleCheckboxChange}
            errors={errors}
          />
        </div>

        {/* Action buttons */}
        <div className="sticky bottom-0 bg-card border border-border rounded-xl p-6 mt-6 space-y-4" style={{ boxShadow: "0 -4px 20px hsl(var(--foreground) / 0.06)" }}>
          <div className="flex flex-wrap gap-3 justify-end">
            <Button variant="outline" className="gap-2" onClick={() => toast.info("Marcado como Under Review (UI only)")}>
              <Clock className="h-4 w-4" />
              Under Review
            </Button>
            <Button variant="destructive" className="gap-2" onClick={() => toast.info("Fornecedor rejeitado (UI only)")}>
              <XCircle className="h-4 w-4" />
              Rejeitar
            </Button>
            <Button className="gap-2 h-12 px-8 rounded-lg text-sm font-semibold bg-primary hover:bg-primary-hover text-primary-foreground" onClick={() => toast.info("Fornecedor aprovado (UI only)")}>
              <ShieldCheck className="h-4 w-4" />
              Aprovar fornecedor
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ——— Admin Create / Supplier Mode ———
  const isAdminCreate = mode === "admin-create";
  const title = isAdminCreate ? "Novo Pedido de Fornecedor" : "Supplier Information";
  const subtitle = isAdminCreate
    ? "Preencha os dados internos para iniciar o processo de onboarding."
    : "Por favor, preencha os dados abaixo para iniciarmos o processo de validação.";

  const currentFormData = isAdminCreate
    ? adminData as unknown as { [key: string]: string }
    : supplierData as unknown as { [key: string]: string };
  const currentRequired = isAdminCreate ? adminRequiredFields : supplierRequiredFields;

  return (
    <div className="w-full max-w-[640px] mx-auto animate-fade-in">
      <div className="mb-8 space-y-3">
        <div className="lg:hidden flex items-center gap-3 mb-6">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">G</span>
          </div>
          <span className="font-semibold text-foreground">Grupo</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">{subtitle}</p>
        <ProgressIndicator
          formData={currentFormData}
          file={isAdminCreate ? null : file}
          requiredFields={currentRequired}
        />
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-10">
        <div className="form-card space-y-10">
          {isAdminCreate ? (
            <AdminCreateFields
              formData={adminData}
              onChange={handleAdminChange}
              onSelectChange={handleSelectChange}
              errors={errors}
            />
          ) : (
            <>
              {/* 01 · Legal Information */}
              <FormSection title="01 · Informação Legal" helperText="Utilizado exclusivamente para efeitos legais e fiscais.">
                <FormField label="Nome legal do fornecedor" name="legal_name" required value={supplierData.legal_name} onChange={handleSupplierChange} error={errors.legal_name} />
                <FormField label="Nome comercial" name="commercial_name" value={supplierData.commercial_name} onChange={handleSupplierChange} />
                <FormSelect label="Tipo de entidade" name="entity_type" required value={supplierData.entity_type} onChange={handleSelectChange("entity_type")} options={entityTypes} error={errors.entity_type} />
                <FormField label="NIF / VAT" name="nif_vat" required value={supplierData.nif_vat} onChange={handleSupplierChange} error={errors.nif_vat} />
                <FormSelect label="País" name="country" required value={supplierData.country} onChange={handleSelectChange("country")} options={countries} error={errors.country} />
                <FormField label="Morada fiscal" name="fiscal_address" required value={supplierData.fiscal_address} onChange={handleSupplierChange} error={errors.fiscal_address} />
              </FormSection>

              <div className="border-t border-border" />

              {/* 02 · Contact Information */}
              <FormSection title="02 · Informação de Contacto" helperText="Usaremos estes contactos apenas para comunicação relacionada com serviços e faturação.">
                <FormField label="Contacto principal" name="primary_contact" required value={supplierData.primary_contact} onChange={handleSupplierChange} error={errors.primary_contact} />
                <FormField label="Email" name="email" type="email" required value={supplierData.email} onChange={handleSupplierChange} error={errors.email} />
                <FormField label="Email de faturação" name="billing_email" type="email" required value={supplierData.billing_email} onChange={handleSupplierChange} error={errors.billing_email} />
                <FormField label="Telefone" name="phone" type="tel" required value={supplierData.phone} onChange={handleSupplierChange} error={errors.phone} />
                <FormField label="Website / LinkedIn" name="website_linkedin" value={supplierData.website_linkedin} onChange={handleSupplierChange} placeholder="https://" />
              </FormSection>

              <div className="border-t border-border" />

              {/* 03 · Fiscal Details */}
              <FormSection title="03 · Dados Fiscais">
                <FormField label="Serviço / Produto" name="service_product" required value={supplierData.service_product} onChange={handleSupplierChange} error={errors.service_product} />
                <FormSelect label="Regime de IVA" name="vat_regime" required value={supplierData.vat_regime} onChange={handleSelectChange("vat_regime")} options={vatRegimes} error={errors.vat_regime} />
                <FormSelect label="Moeda" name="currency" required value={supplierData.currency} onChange={handleSelectChange("currency")} options={currencies} error={errors.currency} />
                {supplierData.currency === "OTHER" && (
                  <FormField label="Indique a moeda" name="currency_other" required value={supplierData.currency_other} onChange={handleSupplierChange} error={errors.currency_other} />
                )}
              </FormSection>

              <div className="border-t border-border" />

              {/* 04 · Banking Information */}
              <FormSection title="04 · Dados Bancários">
                <SecurityNotice />
                <FormField label="Banco" name="bank_name" required value={supplierData.bank_name} onChange={handleSupplierChange} error={errors.bank_name} />
                <FormField label="IBAN" name="iban" required value={supplierData.iban} onChange={handleSupplierChange} error={errors.iban} placeholder="PT50 0000 0000 0000 0000 0000 0" />
                <FormField label="SWIFT / BIC" name="swift" required value={supplierData.swift} onChange={handleSupplierChange} error={errors.swift} />
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
            </>
          )}
        </div>

        {/* Sticky Submit Bar */}
        <div className="sticky bottom-0 bg-card border border-border rounded-xl p-6 space-y-4" style={{ boxShadow: "0 -4px 20px hsl(var(--foreground) / 0.06)" }}>
          {mode === "supplier" && (
            <>
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
            </>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={submitting} size="lg" className="h-12 px-8 rounded-lg text-sm font-semibold bg-primary hover:bg-primary-hover text-primary-foreground">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  A submeter...
                </>
              ) : isAdminCreate ? (
                "Criar pedido"
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

export default SupplierFormWrapper;
