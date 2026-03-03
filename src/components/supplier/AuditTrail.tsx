import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Clock, CheckCircle, XCircle, FileText, Link, Send, Edit, RotateCcw, ArrowRight } from "lucide-react";
import FormSection from "./FormSection";

interface AuditEntry {
  id: string;
  action: string;
  performed_by: string | null;
  previous_status: string | null;
  new_status: string | null;
  metadata: Record<string, unknown> | null;
  timestamp: string;
}

const actionConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  created: { label: "Pedido criado", icon: <FileText className="h-4 w-4" />, color: "text-muted-foreground" },
  link_generated: { label: "Link gerado", icon: <Link className="h-4 w-4" />, color: "text-muted-foreground" },
  supplier_submitted: { label: "Dados submetidos pelo fornecedor", icon: <Send className="h-4 w-4" />, color: "text-blue-600" },
  status_changed: { label: "Estado alterado", icon: <ArrowRight className="h-4 w-4" />, color: "text-muted-foreground" },
  approved: { label: "Fornecedor aprovado", icon: <CheckCircle className="h-4 w-4" />, color: "text-success" },
  rejected: { label: "Fornecedor rejeitado", icon: <XCircle className="h-4 w-4" />, color: "text-destructive" },
  reopened: { label: "Reaberto para revisão", icon: <RotateCcw className="h-4 w-4" />, color: "text-orange-600" },
  edited: { label: "Campos editados", icon: <Edit className="h-4 w-4" />, color: "text-muted-foreground" },
};

const statusLabels: Record<string, string> = {
  draft: "Rascunho",
  waiting_supplier: "A aguardar",
  submitted: "Submetido",
  approved: "Aprovado",
  rejected: "Rejeitado",
  under_review: "Em revisão",
};

const AuditTrail = ({ supplierId }: { supplierId: string }) => {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await (supabase
        .from("supplier_audit_logs")
        .select("*") as any)
        .eq("supplier_id", supplierId)
        .order("timestamp", { ascending: false });

      if (!error && data) setEntries(data as AuditEntry[]);
      setLoading(false);
    };
    fetch();
  }, [supplierId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <FormSection title="06 · Audit Trail" helperText="Histórico de ações sobre este fornecedor.">
        <p className="text-sm text-muted-foreground">Sem registos de auditoria.</p>
      </FormSection>
    );
  }

  return (
    <FormSection title="06 · Audit Trail" helperText="Histórico imutável de todas as ações.">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />

        <div className="space-y-4">
          {entries.map((entry) => {
            const config = actionConfig[entry.action] || actionConfig.status_changed;
            return (
              <div key={entry.id} className="relative flex gap-4 pl-0">
                {/* Dot */}
                <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted ${config.color}`}>
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-sm font-medium text-foreground">{config.label}</p>

                  {(entry.previous_status || entry.new_status) && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {entry.previous_status && statusLabels[entry.previous_status]}{" "}
                      {entry.previous_status && entry.new_status && "→ "}
                      {entry.new_status && statusLabels[entry.new_status]}
                    </p>
                  )}

                  {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                    <div className="mt-1 text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1 inline-block">
                      {(entry.metadata as any).changed_fields
                        ? `Campos: ${(entry.metadata as any).changed_fields.join(", ")}`
                        : JSON.stringify(entry.metadata)}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleString("pt-PT")}
                    </span>
                    {entry.performed_by && (
                      <span className="text-xs text-muted-foreground">· {entry.performed_by}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </FormSection>
  );
};

export default AuditTrail;
