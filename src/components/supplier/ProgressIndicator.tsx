import { useMemo } from "react";

interface ProgressIndicatorProps {
  formData: { [key: string]: string };
  file: File | null;
  requiredFields: string[];
}

const ProgressIndicator = ({ formData, file, requiredFields }: ProgressIndicatorProps) => {
  const { filled, total } = useMemo(() => {
    let count = 0;
    requiredFields.forEach((field) => {
      if (formData[field]?.trim()) count++;
    });
    if (file) count++;
    return { filled: count, total: requiredFields.length + 1 };
  }, [formData, file, requiredFields]);

  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <span>4 secções · Campos obrigatórios assinalados</span>
      <span className="text-border">|</span>
      <span className="tabular-nums font-medium">
        {filled}/{total} campos completos
      </span>
    </div>
  );
};

export default ProgressIndicator;
