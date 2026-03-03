import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SupplierStatus = "draft" | "waiting_supplier" | "submitted" | "approved" | "rejected" | "under_review" | "pending";

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: "Rascunho", className: "bg-muted text-muted-foreground" },
  waiting_supplier: { label: "A aguardar", className: "bg-orange-100 text-orange-700" },
  submitted: { label: "Submetido", className: "bg-blue-100 text-blue-700" },
  approved: { label: "Aprovado", className: "bg-success/10 text-success" },
  rejected: { label: "Rejeitado", className: "bg-destructive/10 text-destructive" },
  under_review: { label: "Em revisão", className: "bg-secondary text-secondary-foreground" },
  pending: { label: "Pendente", className: "bg-muted text-muted-foreground" },
};

const filterOptions: { value: string; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "waiting_supplier", label: "A aguardar" },
  { value: "submitted", label: "Submetido" },
  { value: "under_review", label: "Em revisão" },
  { value: "approved", label: "Aprovado" },
  { value: "rejected", label: "Rejeitado" },
];

interface SupplierRow {
  id: string;
  legal_name: string;
  responsavel: string | null;
  entity_type: string;
  status: string;
  created_at: string;
}

const AdminSuppliers = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<SupplierRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      let query = (supabase
        .from("suppliers")
        .select("id, legal_name, responsavel, entity_type, status, created_at") as any)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) {
        console.error(error);
      } else {
        setSuppliers((data as SupplierRow[]) || []);
      }
      setLoading(false);
    };
    fetchSuppliers();
  }, [statusFilter]);

  return (
    <div className="w-full max-w-[900px] mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Fornecedores</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestão e revisão de fornecedores registados.</p>
        </div>
        <Button onClick={() => navigate("/admin/new")} className="gap-2 h-11 px-6 rounded-lg text-sm font-semibold bg-primary hover:bg-primary-hover text-primary-foreground">
          <Plus className="h-4 w-4" />
          Novo pedido
        </Button>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === opt.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="form-card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : suppliers.length === 0 ? (
          <div className="text-center py-16 text-sm text-muted-foreground">
            Nenhum fornecedor encontrado.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Entidade</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => {
                const status = statusConfig[supplier.status] || statusConfig.pending;
                const displayName = supplier.legal_name?.trim() || supplier.responsavel || "Sem nome";
                return (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{displayName}</TableCell>
                    <TableCell className="text-muted-foreground">{supplier.entity_type || "—"}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(supplier.created_at).toLocaleDateString("pt-PT")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => navigate(`/admin/suppliers/${supplier.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default AdminSuppliers;
