import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle, Loader2, RotateCcw, ShieldCheck, XCircle, Clock, Copy, Link, AlertTriangle } from "lucide-react";
import FormSection from "./FormSection";
import FormField from "./FormField";
import FormSelect from "./FormSelect";
import FileUpload from "./FileUpload";
import ProgressIndicator from "./ProgressIndicator";
import SecurityNotice from "./SecurityNotice";
import AdminCreateFields from "./AdminCreateFields";
import BackofficeFields from "./BackofficeFields";
import SupplierReadOnly from "./SupplierReadOnly";
import AuditTrail from "./AuditTrail";
import { countries } from "@/lib/countries";
import { createAuditLog } from "@/lib/auditLog";

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
  /** Token for supplier mode */
  token?: string;
  /** Supplier ID for admin-review mode */
  supplierId?: string;
}

const SupplierFormWrapper = ({ mode, token, supplierId }: SupplierFormWrapperProps) => {
  const [supplierData, setSupplierData] = useState<SupplierData>(initialSupplierData);
  const [adminData, setAdminData] = useState<AdminData>(initialAdminData);
  const [backofficeData, setBackofficeData] = useState<BackofficeData>(initialBackofficeData);
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recordId, setRecordId] = useState<string | null>(null);
  const [recordStatus, setRecordStatus] = useState<string | null>(null);
  const [errorState, setErrorState] = useState<string | null>(null);

  // Fetch supplier data for supplier mode (by token) or admin-review mode (by id)
  useEffect(() => {
    const fetchSupplier = async () => {
      setLoading(true);
      try {
        let result: { data: any; error: any };

        if (mode === "supplier" && token) {
          result = await (supabase.from("suppliers").select("*") as any).eq("token", token).limit(1).maybeSingle();
        } else if (mode === "admin-review" && supplierId) {
          result = await (supabase.from("suppliers").select("*") as any).eq("id", supplierId).maybeSingle();
        } else {
          setLoading(false);
          return;
        }

        const { data, error } = result;
        if (error || !data) {
          setErrorState(mode === "supplier" ? "Token inválido ou expirado." : "Fornecedor não encontrado.");
          setLoading(false);
          return;
        }

        const d = data as any;
        setRecordId(d.id);
        setRecordStatus(d.status);

        setAdminData({
          responsavel: d.responsavel || "",
          projeto_area: d.projeto_area || "",
          categoria: d.categoria || "",
          entidade: d.entidade || "",
          custo_medio_mensal: d.custo_medio_mensal || "",
          comentarios: d.comentarios || "",
          data_inicio: d.data_inicio || "",
          data_fim: d.data_fim || "",
        });

        setSupplierData({
          legal_name: d.legal_name || "",
          commercial_name: d.commercial_name || "",
          entity_type: d.entity_type || "",
          nif_vat: d.nif_vat || "",
          country: d.country || "",
          fiscal_address: d.fiscal_address || "",
          primary_contact: d.primary_contact || "",
          email: d.email || "",
          billing_email: d.billing_email || "",
          phone: d.phone || "",
          website_linkedin: d.website_linkedin || "",
          service_product: d.service_product || "",
          vat_regime: d.vat_regime || "",
          currency: d.currency || "",
          currency_other: d.currency_other || "",
          bank_name: d.bank_name || "",
          iban: d.iban || "",
          swift: d.swift || "",
        });

        setBackofficeData({
          acesso_dados_pessoais: d.acesso_dados_pessoais || false,
          acesso_sistemas_internos: d.acesso_sistemas_internos || false,
          aprovado_por: d.approved_by || "",
          aprovado_por_finance: d.finance_approved_by || "",
          codigo_interno_1: d.codigo_interno_1 || "",
          codigo_interno_2: d.codigo_interno_2 || "",
          codigo_interno_3: d.codigo_interno_3 || "",
          relevancia_iso: d.relevancia_iso || "",
          condicoes_pagamento: d.condicoes_pagamento || "",
        });
      } catch (err) {
        console.error(err);
        setErrorState("Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };

    if (mode === "supplier" || mode === "admin-review") {
      fetchSupplier();
    }
  }, [mode, token, supplierId]);

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
        const newToken = crypto.randomUUID();
        const { data: inserted, error } = await supabase.from("suppliers").insert({
          token: newToken,
          status: "waiting_supplier",
          responsavel: adminData.responsavel.trim(),
          projeto_area: adminData.projeto_area.trim(),
          categoria: adminData.categoria,
          entidade: adminData.entidade,
          custo_medio_mensal: adminData.custo_medio_mensal.trim() || null,
          comentarios: adminData.comentarios.trim() || null,
          data_inicio: adminData.data_inicio,
          data_fim: adminData.data_fim || null,
        } as any).select("id").single();
        if (error) throw error;
        const newId = (inserted as any).id;
        // Audit: created + link_generated
        await createAuditLog({ supplier_id: newId, action: "created", performed_by: "Admin", new_status: "waiting_supplier" });
        await createAuditLog({ supplier_id: newId, action: "link_generated", performed_by: "Admin", metadata: { token: newToken } });
        setCreatedToken(newToken);
        setSubmitted(true);
      } else if (mode === "supplier" && recordId) {
        let ibanProofUrl: string | null = null;
        if (file) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${crypto.randomUUID()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage.from("iban-proofs").upload(fileName, file);
          if (uploadError) throw uploadError;
          ibanProofUrl = fileName;
        }

        const { error } = await supabase.from("suppliers").update({
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
          status: "submitted",
          supplier_submitted_at: new Date().toISOString(),
        } as any).eq("id", recordId);
        if (error) throw error;
        // Audit: supplier_submitted
        await createAuditLog({
          supplier_id: recordId,
          action: "supplier_submitted",
          performed_by: supplierData.email || "Fornecedor",
          previous_status: "waiting_supplier",
          new_status: "submitted",
        });
        setRecordStatus("submitted");
        setSubmitted(true);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao submeter. Por favor, tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!recordId) return;

    // Approval lock: if approved, only allow moving to under_review
    if (recordStatus === "approved" && newStatus !== "under_review") {
      toast.error("Fornecedor aprovado. Apenas pode reabrir para revisão.");
      return;
    }

    setSubmitting(true);
    try {
      const previousStatus = recordStatus;
      const updateData: any = { status: newStatus };

      if (newStatus === "approved") {
        updateData.approved_at = new Date().toISOString();
        updateData.approved_by = backofficeData.aprovado_por || "Admin";
        updateData.finance_approved_by = backofficeData.aprovado_por_finance || null;
      }

      // Save backoffice fields only if not moving from approved (lock)
      if (recordStatus !== "approved") {
        updateData.acesso_dados_pessoais = backofficeData.acesso_dados_pessoais;
        updateData.acesso_sistemas_internos = backofficeData.acesso_sistemas_internos;
        updateData.approved_by = backofficeData.aprovado_por || null;
        updateData.finance_approved_by = backofficeData.aprovado_por_finance || null;
        updateData.codigo_interno_1 = backofficeData.codigo_interno_1 || null;
        updateData.codigo_interno_2 = backofficeData.codigo_interno_2 || null;
        updateData.codigo_interno_3 = backofficeData.codigo_interno_3 || null;
        updateData.relevancia_iso = backofficeData.relevancia_iso || null;
        updateData.condicoes_pagamento = backofficeData.condicoes_pagamento || null;
      }

      const { error } = await (supabase.from("suppliers").update(updateData) as any).eq("id", recordId);
      if (error) throw error;

      // Determine audit action
      let auditAction = "status_changed";
      if (newStatus === "approved") auditAction = "approved";
      else if (newStatus === "rejected") auditAction = "rejected";
      else if (previousStatus === "approved" && newStatus === "under_review") auditAction = "reopened";

      await createAuditLog({
        supplier_id: recordId,
        action: auditAction,
        performed_by: backofficeData.aprovado_por || "Admin",
        previous_status: previousStatus,
        new_status: newStatus,
      });

      setRecordStatus(newStatus);

      const labels: Record<string, string> = {
        approved: "Fornecedor aprovado com sucesso.",
        rejected: "Fornecedor rejeitado.",
        under_review: "Marcado como Under Review.",
      };
      toast.success(labels[newStatus] || "Estado atualizado.");
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao atualizar estado.");
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
    setCreatedToken(null);
  };

  const copyLink = () => {
    if (!createdToken) return;
    const link = `${window.location.origin}/supplier/${createdToken}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copiado!");
  };

  // ——— Loading ———
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ——— Error state ———
  if (errorState) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="form-card max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Erro</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">{errorState}</p>
          </div>
        </div>
      </div>
    );
  }

  // ——— Supplier already submitted ———
  if (mode === "supplier" && recordStatus && recordStatus !== "waiting_supplier") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="form-card max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-7 w-7 text-success" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Dados já submetidos</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Os seus dados já foram submetidos e estão a ser processados pela nossa equipa.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ——— Success screen ———
  if (submitted) {
    if (mode === "admin-create" && createdToken) {
      const supplierLink = `${window.location.origin}/supplier/${createdToken}`;
      return (
        <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
          <div className="form-card max-w-lg w-full text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-14 w-14 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-7 w-7 text-success" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">Pedido criado com sucesso</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Envie o link abaixo ao fornecedor para que preencha os dados.
              </p>
            </div>
            <div className="bg-muted rounded-lg p-4 flex items-center gap-3">
              <Link className="h-4 w-4 text-muted-foreground shrink-0" />
              <code className="text-xs text-foreground break-all flex-1 text-left">{supplierLink}</code>
              <Button variant="outline" size="sm" onClick={copyLink} className="gap-1.5 shrink-0">
                <Copy className="h-3.5 w-3.5" />
                Copiar
              </Button>
            </div>
            <Button onClick={handleReset} variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Criar novo pedido
            </Button>
          </div>
        </div>
      );
    }

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
        </div>
      </div>
    );
  }

  // ——— Admin Review Mode ———
  if (mode === "admin-review") {
    const statusLabel: Record<string, string> = {
      draft: "Rascunho",
      waiting_supplier: "A aguardar fornecedor",
      submitted: "Submetido",
      approved: "Aprovado",
      rejected: "Rejeitado",
      under_review: "Em revisão",
    };

    const statusIcon: Record<string, React.ReactNode> = {
      waiting_supplier: <Clock className="h-5 w-5" />,
      submitted: <CheckCircle className="h-5 w-5" />,
      approved: <ShieldCheck className="h-5 w-5" />,
      rejected: <XCircle className="h-5 w-5" />,
      under_review: <RotateCcw className="h-5 w-5" />,
    };

    const statusColorClass: Record<string, string> = {
      waiting_supplier: "bg-orange-50 border-orange-200 text-orange-700",
      submitted: "bg-blue-50 border-blue-200 text-blue-700",
      approved: "bg-emerald-50 border-emerald-200 text-emerald-700",
      rejected: "bg-red-50 border-red-200 text-red-700",
      under_review: "bg-amber-50 border-amber-200 text-amber-700",
      draft: "bg-muted border-border text-muted-foreground",
    };

    return (
      <div className="w-full max-w-[640px] mx-auto animate-fade-in space-y-6">
        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Revisão de Fornecedor</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Reveja a informação submetida e preencha os campos de backoffice.
          </p>
        </div>

        {/* Status Banner */}
        {recordStatus && (
          <div className={`flex items-center gap-3 rounded-xl border px-5 py-4 ${statusColorClass[recordStatus] || statusColorClass.draft}`}>
            {statusIcon[recordStatus] || <Clock className="h-5 w-5" />}
            <div>
              <p className="text-sm font-semibold">{statusLabel[recordStatus] || recordStatus}</p>
              <p className="text-xs opacity-75">
                {recordStatus === "waiting_supplier" && "O fornecedor ainda não preencheu os dados."}
                {recordStatus === "submitted" && "O fornecedor submeteu os dados. Pronto para revisão."}
                {recordStatus === "approved" && "Este fornecedor foi aprovado."}
                {recordStatus === "rejected" && "Este fornecedor foi rejeitado."}
                {recordStatus === "under_review" && "Em processo de revisão interna."}
              </p>
            </div>
          </div>
        )}

        {/* Section 1: Internal Request */}
        <div className="form-card space-y-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center justify-center h-6 w-6 rounded-md bg-muted text-muted-foreground text-xs font-bold">1</span>
            <h2 className="text-sm font-semibold text-foreground">Pedido Interno</h2>
          </div>
          <AdminCreateFields formData={adminData} onChange={() => {}} onSelectChange={() => () => {}} errors={{}} readOnly />
        </div>

        {/* Section 2: Supplier Submitted Information */}
        <div className="form-card space-y-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center justify-center h-6 w-6 rounded-md bg-muted text-muted-foreground text-xs font-bold">2</span>
            <h2 className="text-sm font-semibold text-foreground">Informação do Fornecedor</h2>
          </div>
          {recordStatus === "waiting_supplier" ? (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
              <Clock className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">O fornecedor ainda não submeteu os dados.</p>
            </div>
          ) : (
            <SupplierReadOnly data={supplierData} />
          )}
        </div>

        {/* Section 3: Backoffice Review & Approval */}
        <div className="form-card space-y-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center justify-center h-6 w-6 rounded-md bg-muted text-muted-foreground text-xs font-bold">3</span>
            <h2 className="text-sm font-semibold text-foreground">Backoffice & Aprovação</h2>
          </div>
          <BackofficeFields
            formData={backofficeData}
            onChange={recordStatus === "approved" ? () => {} : handleBackofficeChange}
            onSelectChange={recordStatus === "approved" ? () => () => {} : handleSelectChange}
            onCheckboxChange={recordStatus === "approved" ? () => () => {} : handleCheckboxChange}
            errors={errors}
          />
          <div className="border-t border-border" />
          {recordId && <AuditTrail supplierId={recordId} />}
        </div>

        {/* Action buttons */}
        {recordStatus === "approved" ? (
          <div className="sticky bottom-0 bg-card border border-border rounded-xl p-6" style={{ boxShadow: "0 -4px 20px hsl(var(--foreground) / 0.06)" }}>
            <div className="flex flex-wrap gap-3 justify-end">
              <Button variant="outline" className="gap-2" disabled={submitting} onClick={() => handleStatusChange("under_review")}>
                <RotateCcw className="h-4 w-4" />
                Reabrir para revisão
              </Button>
            </div>
          </div>
        ) : recordStatus !== "rejected" ? (
          <div className="sticky bottom-0 bg-card border border-border rounded-xl p-6 space-y-4" style={{ boxShadow: "0 -4px 20px hsl(var(--foreground) / 0.06)" }}>
            <div className="flex flex-wrap gap-3 justify-end">
              <Button variant="outline" className="gap-2" disabled={submitting} onClick={() => handleStatusChange("under_review")}>
                <Clock className="h-4 w-4" />
                Under Review
              </Button>
              <Button variant="destructive" className="gap-2" disabled={submitting} onClick={() => handleStatusChange("rejected")}>
                <XCircle className="h-4 w-4" />
                Rejeitar
              </Button>
              <Button className="gap-2 h-12 px-8 rounded-lg text-sm font-semibold bg-primary hover:bg-primary-hover text-primary-foreground" disabled={submitting} onClick={() => handleStatusChange("approved")}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                Aprovar fornecedor
              </Button>
            </div>
          </div>
        ) : null}
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
        <ProgressIndicator formData={currentFormData} file={isAdminCreate ? null : file} requiredFields={currentRequired} />
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-10">
        <div className="form-card space-y-10">
          {isAdminCreate ? (
            <AdminCreateFields formData={adminData} onChange={handleAdminChange} onSelectChange={handleSelectChange} errors={errors} />
          ) : (
            <>
              <FormSection title="01 · Informação Legal" helperText="Utilizado exclusivamente para efeitos legais e fiscais.">
                <FormField label="Nome legal do fornecedor" name="legal_name" required value={supplierData.legal_name} onChange={handleSupplierChange} error={errors.legal_name} />
                <FormField label="Nome comercial" name="commercial_name" value={supplierData.commercial_name} onChange={handleSupplierChange} />
                <FormSelect label="Tipo de entidade" name="entity_type" required value={supplierData.entity_type} onChange={handleSelectChange("entity_type")} options={entityTypes} error={errors.entity_type} />
                <FormField label="NIF / VAT" name="nif_vat" required value={supplierData.nif_vat} onChange={handleSupplierChange} error={errors.nif_vat} />
                <FormSelect label="País" name="country" required value={supplierData.country} onChange={handleSelectChange("country")} options={countries} error={errors.country} />
                <FormField label="Morada fiscal" name="fiscal_address" required value={supplierData.fiscal_address} onChange={handleSupplierChange} error={errors.fiscal_address} />
              </FormSection>

              <div className="border-t border-border" />

              <FormSection title="02 · Informação de Contacto" helperText="Usaremos estes contactos apenas para comunicação relacionada com serviços e faturação.">
                <FormField label="Contacto principal" name="primary_contact" required value={supplierData.primary_contact} onChange={handleSupplierChange} error={errors.primary_contact} />
                <FormField label="Email" name="email" type="email" required value={supplierData.email} onChange={handleSupplierChange} error={errors.email} />
                <FormField label="Email de faturação" name="billing_email" type="email" required value={supplierData.billing_email} onChange={handleSupplierChange} error={errors.billing_email} />
                <FormField label="Telefone" name="phone" type="tel" required value={supplierData.phone} onChange={handleSupplierChange} error={errors.phone} />
                <FormField label="Website / LinkedIn" name="website_linkedin" value={supplierData.website_linkedin} onChange={handleSupplierChange} placeholder="https://" />
              </FormSection>

              <div className="border-t border-border" />

              <FormSection title="03 · Dados Fiscais">
                <FormField label="Serviço / Produto" name="service_product" required value={supplierData.service_product} onChange={handleSupplierChange} error={errors.service_product} />
                <FormSelect label="Regime de IVA" name="vat_regime" required value={supplierData.vat_regime} onChange={handleSelectChange("vat_regime")} options={vatRegimes} error={errors.vat_regime} />
                <FormSelect label="Moeda" name="currency" required value={supplierData.currency} onChange={handleSelectChange("currency")} options={currencies} error={errors.currency} />
                {supplierData.currency === "OTHER" && (
                  <FormField label="Indique a moeda" name="currency_other" required value={supplierData.currency_other} onChange={handleSupplierChange} error={errors.currency_other} />
                )}
              </FormSection>

              <div className="border-t border-border" />

              <FormSection title="04 · Dados Bancários">
                <SecurityNotice />
                <FormField label="Banco" name="bank_name" required value={supplierData.bank_name} onChange={handleSupplierChange} error={errors.bank_name} />
                <FormField label="IBAN" name="iban" required value={supplierData.iban} onChange={handleSupplierChange} error={errors.iban} placeholder="PT50 0000 0000 0000 0000 0000 0" />
                <FormField label="SWIFT / BIC" name="swift" required value={supplierData.swift} onChange={handleSupplierChange} error={errors.swift} />
                <FileUpload label="Comprovativo de IBAN" name="iban_proof" required file={file} onFileChange={(f) => { setFile(f); if (errors.file) setErrors((prev) => ({ ...prev, file: undefined })); }} error={errors.file} />
              </FormSection>
            </>
          )}
        </div>

        <div className="sticky bottom-0 bg-card border border-border rounded-xl p-6 space-y-4" style={{ boxShadow: "0 -4px 20px hsl(var(--foreground) / 0.06)" }}>
          {mode === "supplier" && (
            <>
              <div className="flex items-start gap-3">
                <Checkbox id="consent" checked={consent} onCheckedChange={(checked) => { setConsent(checked === true); if (errors.consent) setErrors((prev) => ({ ...prev, consent: undefined })); }} className="mt-0.5" />
                <Label htmlFor="consent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                  Declaro que as informações fornecidas são verdadeiras e autorizo o tratamento dos dados para efeitos de gestão contratual e faturação, nos termos legais aplicáveis.
                </Label>
              </div>
              {errors.consent && <p className="text-xs text-destructive">{errors.consent}</p>}
            </>
          )}
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting} size="lg" className="h-12 px-8 rounded-lg text-sm font-semibold bg-primary hover:bg-primary-hover text-primary-foreground">
              {submitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />A submeter...</>) : isAdminCreate ? "Criar pedido" : "Submeter dados"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SupplierFormWrapper;
