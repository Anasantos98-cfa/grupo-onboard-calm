import { useParams } from "react-router-dom";
import BrandPanel from "@/components/supplier/BrandPanel";
import SupplierFormWrapper from "@/components/supplier/SupplierFormWrapper";

const SupplierToken = () => {
  const { token } = useParams<{ token: string }>();

  return (
    <div className="flex min-h-screen">
      <BrandPanel />
      <main className="flex-1 bg-background py-10 md:py-16 px-4 md:px-8 lg:px-12 overflow-y-auto">
        {/* Token will be used for backend validation later */}
        <SupplierFormWrapper mode="supplier" />
      </main>
    </div>
  );
};

export default SupplierToken;
