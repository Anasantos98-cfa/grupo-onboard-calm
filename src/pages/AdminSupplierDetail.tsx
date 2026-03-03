import { useParams } from "react-router-dom";
import SupplierFormWrapper from "@/components/supplier/SupplierFormWrapper";

const AdminSupplierDetail = () => {
  const { id } = useParams<{ id: string }>();
  return <SupplierFormWrapper mode="admin-review" supplierId={id} />;
};

export default AdminSupplierDetail;
