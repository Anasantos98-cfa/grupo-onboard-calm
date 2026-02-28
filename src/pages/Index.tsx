import SupplierForm from "@/components/supplier/SupplierForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background py-12 md:py-16 px-4 animate-fade-in">
      <div className="max-w-[640px] mx-auto mb-10 text-center space-y-4">
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">G</span>
          </div>
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
