import { Lock } from "lucide-react";

const SecurityNotice = () => {
  return (
    <div className="rounded-lg bg-muted/60 px-4 py-3 flex items-start gap-3">
      <Lock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <p className="text-sm text-muted-foreground leading-relaxed">
        Os dados bancários são utilizados exclusivamente para processamento de pagamentos e armazenados de forma segura.
      </p>
    </div>
  );
};

export default SecurityNotice;
