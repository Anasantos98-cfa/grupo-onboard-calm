import FormSection from "./FormSection";

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
  bank_name: string;
  iban: string;
  swift: string;
}

const ReadOnlyField = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <p className="text-xs font-medium text-muted-foreground">{label}</p>
    <p className="text-sm text-foreground">{value || "—"}</p>
  </div>
);

const SupplierReadOnly = ({ data }: { data: SupplierData }) => {
  return (
    <div className="space-y-10">
      <FormSection title="01 · Informação Legal">
        <ReadOnlyField label="Nome legal" value={data.legal_name} />
        <ReadOnlyField label="Nome comercial" value={data.commercial_name} />
        <ReadOnlyField label="Tipo de entidade" value={data.entity_type} />
        <ReadOnlyField label="NIF / VAT" value={data.nif_vat} />
        <ReadOnlyField label="País" value={data.country} />
        <ReadOnlyField label="Morada fiscal" value={data.fiscal_address} />
      </FormSection>

      <div className="border-t border-border" />

      <FormSection title="02 · Informação de Contacto">
        <ReadOnlyField label="Contacto principal" value={data.primary_contact} />
        <ReadOnlyField label="Email" value={data.email} />
        <ReadOnlyField label="Email de faturação" value={data.billing_email} />
        <ReadOnlyField label="Telefone" value={data.phone} />
        <ReadOnlyField label="Website / LinkedIn" value={data.website_linkedin} />
      </FormSection>

      <div className="border-t border-border" />

      <FormSection title="03 · Dados Fiscais">
        <ReadOnlyField label="Serviço / Produto" value={data.service_product} />
        <ReadOnlyField label="Regime de IVA" value={`${data.vat_regime}%`} />
        <ReadOnlyField label="Moeda" value={data.currency} />
      </FormSection>

      <div className="border-t border-border" />

      <FormSection title="04 · Dados Bancários">
        <ReadOnlyField label="Banco" value={data.bank_name} />
        <ReadOnlyField label="IBAN" value={data.iban} />
        <ReadOnlyField label="SWIFT / BIC" value={data.swift} />
      </FormSection>
    </div>
  );
};

export default SupplierReadOnly;
