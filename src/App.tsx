import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminNewSupplier from "./pages/AdminNewSupplier";
import AdminSuppliers from "./pages/AdminSuppliers";
import AdminSupplierDetail from "./pages/AdminSupplierDetail";
import SupplierToken from "./pages/SupplierToken";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/new" element={<AdminNewSupplier />} />
          <Route path="/admin/suppliers" element={<AdminSuppliers />} />
          <Route path="/admin/suppliers/:id" element={<AdminSupplierDetail />} />
          <Route path="/supplier/:token" element={<SupplierToken />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
