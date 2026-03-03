import { useParams } from "react-router-dom";
import SupplierFormWrapper from "@/components/supplier/SupplierFormWrapper";

const SupplierToken = () => {
  const { token } = useParams<{ token: string }>();
  return <SupplierFormWrapper mode="supplier" token={token} />;
};

export default SupplierToken;
