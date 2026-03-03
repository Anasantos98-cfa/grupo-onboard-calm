import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FormSection from "./FormSection";
import FormField from "./FormField";
import FormSelect from "./FormSelect";

const relevanciaIso = [
  { value: "sim", label: "Sim" },
  { value: "nao", label: "Não" },
  { value: "pendente", label: "Pendente" },
];

const condicoesPagamento = [
  { value: "30_dias", label: "30 dias" },
  { value: "60_dias", label: "60 dias" },
  { value: "90_dias", label: "90 dias" },
  { value: "imediato", label: "Imediato" },
];

interface BackofficeFieldsProps {
  formData: {
    acesso_dados_pessoais: boolean;
    acesso_sistemas_internos: boolean;
    aprovado_por: string;
    aprovado_por_finance: string;
    codigo_interno_1: string;
    codigo_interno_2: string;
    codigo_interno_3: string;
    relevancia_iso: string;
    condicoes_pagamento: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string) => (value: string) => void;
  onCheckboxChange: (name: string) => (checked: boolean) => void;
  errors: Record<string, string | undefined>;
}

const BackofficeFields = ({ formData, onChange, onSelectChange, onCheckboxChange, errors }: BackofficeFieldsProps) => {
  return (
    <FormSection title="05 · Backoffice" helperText="Campos internos de aprovação e classificação.">
      <div className="flex items-center gap-3">
        <Checkbox
          id="acesso_dados_pessoais"
          checked={formData.acesso_dados_pessoais}
          onCheckedChange={onCheckboxChange("acesso_dados_pessoais")}
        />
        <Label htmlFor="acesso_dados_pessoais" className="text-sm cursor-pointer">
          Acesso a dados pessoais
        </Label>
      </div>

      <div className="flex items-center gap-3">
        <Checkbox
          id="acesso_sistemas_internos"
          checked={formData.acesso_sistemas_internos}
          onCheckedChange={onCheckboxChange("acesso_sistemas_internos")}
        />
        <Label htmlFor="acesso_sistemas_internos" className="text-sm cursor-pointer">
          Acesso a sistemas internos
        </Label>
      </div>

      <FormField label="Aprovado por" name="aprovado_por" value={formData.aprovado_por} onChange={onChange} error={errors.aprovado_por} />
      <FormField label="Aprovado por (Finance)" name="aprovado_por_finance" value={formData.aprovado_por_finance} onChange={onChange} error={errors.aprovado_por_finance} />
      <FormField label="Código interno fornecedor 1" name="codigo_interno_1" value={formData.codigo_interno_1} onChange={onChange} />
      <FormField label="Código interno fornecedor 2" name="codigo_interno_2" value={formData.codigo_interno_2} onChange={onChange} />
      <FormField label="Código interno fornecedor 3" name="codigo_interno_3" value={formData.codigo_interno_3} onChange={onChange} />
      <FormSelect label="Relevância ISO" name="relevancia_iso" value={formData.relevancia_iso} onChange={onSelectChange("relevancia_iso")} options={relevanciaIso} error={errors.relevancia_iso} />
      <FormSelect label="Condições de pagamento" name="condicoes_pagamento" value={formData.condicoes_pagamento} onChange={onSelectChange("condicoes_pagamento")} options={condicoesPagamento} error={errors.condicoes_pagamento} />
    </FormSection>
  );
};

export default BackofficeFields;
