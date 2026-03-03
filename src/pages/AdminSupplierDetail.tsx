import { useParams } from "react-router-dom";
import BrandPanel from "@/components/supplier/BrandPanel";
import SupplierFormWrapper from "@/components/supplier/SupplierFormWrapper";

// Mock data for review mode
const mockSupplierData = {
  legal_name: "Acme Consulting, Lda.",
  commercial_name: "Acme",
  entity_type: "Empresa",
  nif_vat: "PT123456789",
  country: "Portugal",
  fiscal_address: "Rua do Exemplo, 123, Lisboa",
  primary_contact: "João Silva",
  email: "joao@acme.pt",
  billing_email: "faturacao@acme.pt",
  phone: "+351 912 345 678",
  website_linkedin: "https://acme.pt",
  service_product: "Consultoria de TI",
  vat_regime: "23",
  currency: "EUR",
  currency_other: "",
  bank_name: "Millennium BCP",
  iban: "PT50000000000000000000000",
  swift: "BCOMPTPL",
};

const mockAdminData = {
  responsavel: "Ana Costa",
  projeto_area: "Tecnologia",
  categoria: "Consultoria",
  entidade: "Grupo A",
  custo_medio_mensal: "5000",
  comentarios: "Fornecedor recomendado pelo departamento de TI.",
  data_inicio: "2025-04-01",
  data_fim: "2025-12-31",
};

const AdminSupplierDetail = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex min-h-screen">
      <BrandPanel />
      <main className="flex-1 bg-background py-10 md:py-16 px-4 md:px-8 lg:px-12 overflow-y-auto">
        <SupplierFormWrapper
          mode="admin-review"
          reviewData={mockSupplierData}
          reviewAdminData={mockAdminData}
        />
      </main>
    </div>
  );
};

export default AdminSupplierDetail;
