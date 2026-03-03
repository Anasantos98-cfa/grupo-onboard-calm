import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye } from "lucide-react";
import BrandPanel from "@/components/supplier/BrandPanel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockSuppliers = [
  { id: "1", name: "Acme Consulting, Lda.", entity: "Empresa", status: "pending", created: "2025-03-01" },
  { id: "2", name: "Maria Ferreira", entity: "Freelancer", status: "approved", created: "2025-02-20" },
  { id: "3", name: "TechSoft, SA", entity: "Empresa", status: "under_review", created: "2025-02-15" },
  { id: "4", name: "João Santos ENI", entity: "ENI", status: "rejected", created: "2025-01-28" },
  { id: "5", name: "Design Studio, Lda.", entity: "Empresa", status: "pending", created: "2025-03-02" },
];

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pendente", variant: "outline" },
  approved: { label: "Aprovado", variant: "default" },
  under_review: { label: "Em revisão", variant: "secondary" },
  rejected: { label: "Rejeitado", variant: "destructive" },
};

const AdminSuppliers = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      <BrandPanel />
      <main className="flex-1 bg-background py-10 md:py-16 px-4 md:px-8 lg:px-12 overflow-y-auto">
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

          <div className="form-card p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Fornecedor</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSuppliers.map((supplier) => {
                  const status = statusMap[supplier.status] || statusMap.pending;
                  return (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.entity}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{supplier.created}</TableCell>
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSuppliers;
