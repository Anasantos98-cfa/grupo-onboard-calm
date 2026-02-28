import grupoLogo from "@/assets/grupo-logo.svg";
import { Lock, FileText, CreditCard } from "lucide-react";

const BrandPanel = () => {
  return (
    <aside className="hidden lg:flex lg:w-[38%] xl:w-[35%] panel-bg flex-col justify-between p-10 xl:p-12 min-h-screen sticky top-0">
      <div className="space-y-10">
        <div>
          <img src={grupoLogo} alt="Grupo logo" className="h-8 w-auto brightness-0 invert" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-panel-foreground">
            Supplier Onboarding Portal
          </h1>
          <p className="text-sm leading-relaxed text-panel-muted">
            Plataforma interna para registo e validação de fornecedores.
          </p>
        </div>

        <div className="w-8 h-px bg-panel-muted/30" />

        <ul className="space-y-4">
          <li className="flex items-center gap-3 text-sm text-panel-muted">
            <Lock className="h-4 w-4 shrink-0" />
            <span>Dados protegidos</span>
          </li>
          <li className="flex items-center gap-3 text-sm text-panel-muted">
            <FileText className="h-4 w-4 shrink-0" />
            <span>Validação fiscal</span>
          </li>
          <li className="flex items-center gap-3 text-sm text-panel-muted">
            <CreditCard className="h-4 w-4 shrink-0" />
            <span>Processamento seguro</span>
          </li>
        </ul>
      </div>

      <p className="text-xs text-panel-muted/50">
        © {new Date().getFullYear()} Grupo. Todos os direitos reservados.
      </p>
    </aside>
  );
};

export default BrandPanel;
