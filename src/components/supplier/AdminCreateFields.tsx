import FormSection from "./FormSection";
import FormField from "./FormField";
import FormSelect from "./FormSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const categories = [
  { value: "servicos", label: "Serviços" },
  { value: "consultoria", label: "Consultoria" },
  { value: "tecnologia", label: "Tecnologia" },
  { value: "marketing", label: "Marketing" },
  { value: "outro", label: "Outro" },
];

const entities = [
  { value: "grupo_a", label: "Grupo A" },
  { value: "grupo_b", label: "Grupo B" },
  { value: "grupo_c", label: "Grupo C" },
];

interface AdminCreateFieldsProps {
  formData: {
    responsavel: string;
    projeto_area: string;
    categoria: string;
    entidade: string;
    custo_medio_mensal: string;
    comentarios: string;
    data_inicio: string;
    data_fim: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string) => (value: string) => void;
  errors: Record<string, string | undefined>;
  readOnly?: boolean;
}

const AdminCreateFields = ({ formData, onChange, onSelectChange, errors, readOnly = false }: AdminCreateFieldsProps) => {
  if (readOnly) {
    return (
      <FormSection title="00 · Pedido Interno" helperText="Informação interna associada ao pedido.">
        <ReadOnlyField label="Nome responsável" value={formData.responsavel} />
        <ReadOnlyField label="Projeto / Área interna" value={formData.projeto_area} />
        <ReadOnlyField label="Categoria" value={formData.categoria} />
        <ReadOnlyField label="Entidade" value={formData.entidade} />
        <ReadOnlyField label="Custo médio mensal" value={formData.custo_medio_mensal ? `€${formData.custo_medio_mensal}` : "—"} />
        <ReadOnlyField label="Comentários" value={formData.comentarios} />
        <ReadOnlyField label="Data início" value={formData.data_inicio} />
        <ReadOnlyField label="Data fim" value={formData.data_fim} />
      </FormSection>
    );
  }

  return (
    <FormSection title="00 · Pedido Interno" helperText="Dados internos para gestão e rastreabilidade do pedido.">
      <FormField label="Nome responsável" name="responsavel" required value={formData.responsavel} onChange={onChange} error={errors.responsavel} />
      <FormField label="Projeto / Área interna" name="projeto_area" required value={formData.projeto_area} onChange={onChange} error={errors.projeto_area} />
      <FormSelect label="Categoria" name="categoria" required value={formData.categoria} onChange={onSelectChange("categoria")} options={categories} error={errors.categoria} />
      <FormSelect label="Entidade" name="entidade" required value={formData.entidade} onChange={onSelectChange("entidade")} options={entities} error={errors.entidade} />
      <div className="space-y-1.5">
        <Label className="form-label">Custo médio mensal (€)</Label>
        <Input name="custo_medio_mensal" type="number" value={formData.custo_medio_mensal} onChange={onChange} placeholder="0.00" />
        {errors.custo_medio_mensal && <p className="text-xs text-destructive">{errors.custo_medio_mensal}</p>}
      </div>
      <FormField label="Comentários" name="comentarios" value={formData.comentarios} onChange={onChange} />
      <FormField label="Data início" name="data_inicio" type="date" required value={formData.data_inicio} onChange={onChange} error={errors.data_inicio} />
      <FormField label="Data fim" name="data_fim" type="date" value={formData.data_fim} onChange={onChange} />
    </FormSection>
  );
};

const ReadOnlyField = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <p className="text-xs font-medium text-muted-foreground">{label}</p>
    <p className="text-sm text-foreground">{value || "—"}</p>
  </div>
);

export default AdminCreateFields;
