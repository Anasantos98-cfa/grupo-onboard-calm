import SupplierForm from "@/components/supplier/SupplierForm";
import grupoLogo from "@/assets/grupo-logo.webp";

const Index = () => {
  return (
    <div className="min-h-screen bg-background py-12 md:py-16 px-4 animate-fade-in">
      <div className="max-w-[640px] mx-auto mb-10 text-center space-y-4">
        <div className="flex justify-center mb-6">
          <img src={grupoLogo} alt="Grupo logo" className="h-10 w-auto" />
        </div>
        <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground">
          Supplier Information Form
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
          Para iniciarmos a colaboração, solicitamos os seguintes dados.
          <br />
          A sua informação será tratada com confidencialidade.
        </p>
      </div>
      <SupplierForm />
    </div>
  );
};

export default Index;
