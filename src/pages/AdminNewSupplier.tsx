import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle, Loader2, RotateCcw, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import FormField from "@/components/supplier/FormField";
import FormSelect from "@/components/supplier/FormSelect";
import FormSection from "@/components/supplier/FormSection";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const WEBHOOK_URL = "https://codeforall.app.n8n.cloud/webhook/fornecedor-pedido";

const categorias = [
  { value: "Accounting & Adm", label: "Accounting & Adm" },
  { value: "Administrative", label: "Administrative" },
  { value: "Assets", label: "Assets" },
  { value: "Cleaning", label: "Cleaning" },
  { value: "Communications Services", label: "Communications Services" },
  { value: "Consulting", label: "Consulting" },
  { value: "Contractor", label: "Contractor" },
  { value: "Events", label: "Events" },
  { value: "Finance", label: "Finance" },
  { value: "HR", label: "HR" },
  { value: "Insurance", label: "Insurance" },
  { value: "Legal Services - Lawyers", label: "Legal Services - Lawyers" },
  { value: "Marketing", label: "Marketing" },
  { value: "Operations", label: "Operations" },
  { value: "Platforms", label: "Platforms" },
  { value: "Rent", label: "Rent" },
  { value: "Technology", label: "Technology" },
  { value: "Training", label: "Training" },
  { value: "Travel", label: "Travel" },
  { value: "Utilities", label: "Utilities" },
];

interface FormData {
  nome_fornecedor: string;
  email_fornecedor: string;
  responsavel_area: string;
  categoria: string;
  justificacao: string;
}

const initialFormData: FormData = {
  nome_fornecedor: "",
  email_fornecedor: "",
  responsavel_area: "",
  categoria: "",
  justificacao: "",
};

const requiredFields: (keyof FormData)[] = [
  "nome_fornecedor",
  "email_fornecedor",
  "responsavel_area",
  "categoria",
  "justificacao",
];

const AdminNewSupplier = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string | undefined> = {};
    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = "Este campo é obrigatório.";
      }
    });
    if (formData.email_fornecedor && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_fornecedor)) {
      newErrors.email_fornecedor = "Email inválido.";
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
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome_fornecedor: formData.nome_fornecedor.trim(),
          email_fornecedor: formData.email_fornecedor.trim(),
          responsavel_area: formData.responsavel_area.trim(),
          categoria: formData.categoria,
          justificacao: formData.justificacao.trim(),
        }),
      });

      if (!response.ok) throw new Error("Webhook error");
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao submeter. Por favor, tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
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
            <h2 className="text-xl font-semibold text-foreground">Pedido criado com sucesso</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              O pedido foi enviado e será processado pela equipa responsável.
            </p>
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
    <div className="w-full max-w-[640px] mx-auto animate-fade-in">
      <div className="mb-8 space-y-3">
        <div className="lg:hidden flex items-center gap-3 mb-6">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">G</span>
          </div>
          <span className="font-semibold text-foreground">Grupo</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Novo Pedido de Fornecedor</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Preencha os dados para iniciar o processo de onboarding do fornecedor.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-10">
        <div className="form-card space-y-10">
          <FormSection title="Dados do Pedido" helperText="Informação necessária para submeter o pedido de fornecedor.">
            <FormField
              label="Nome do fornecedor"
              name="nome_fornecedor"
              required
              value={formData.nome_fornecedor}
              onChange={handleChange}
              error={errors.nome_fornecedor}
            />
            <FormField
              label="Email do fornecedor"
              name="email_fornecedor"
              type="email"
              required
              value={formData.email_fornecedor}
              onChange={handleChange}
              error={errors.email_fornecedor}
            />
            <FormField
              label="Responsável / Área"
              name="responsavel_area"
              required
              value={formData.responsavel_area}
              onChange={handleChange}
              error={errors.responsavel_area}
            />
            <FormSelect
              label="Categoria"
              name="categoria"
              required
              value={formData.categoria}
              onChange={handleSelectChange("categoria")}
              options={categorias}
              error={errors.categoria}
            />
            <div className="space-y-1.5">
              <Label htmlFor="justificacao" className="form-label">
                Justificação
                <span className="text-destructive ml-0.5">*</span>
              </Label>
              <Textarea
                id="justificacao"
                name="justificacao"
                value={formData.justificacao}
                onChange={handleChange}
                placeholder="Explique a necessidade deste fornecedor..."
                className={errors.justificacao ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.justificacao && <p className="text-sm text-destructive">{errors.justificacao}</p>}
            </div>
          </FormSection>
        </div>

        <div className="sticky bottom-0 bg-card border border-border rounded-xl p-6" style={{ boxShadow: "0 -4px 20px hsl(var(--foreground) / 0.06)" }}>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={submitting}
              size="lg"
              className="h-12 px-8 rounded-lg text-sm font-semibold bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  A submeter...
                </>
              ) : (
                "Criar pedido"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminNewSupplier;
