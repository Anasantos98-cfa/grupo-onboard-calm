import { Label } from "@/components/ui/label";
import { Upload, FileCheck, X } from "lucide-react";
import { useRef, useState } from "react";

interface FileUploadProps {
  label: string;
  name: string;
  required?: boolean;
  accept?: string;
  helperText?: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string;
}

const FileUpload = ({ label, name, required, accept = ".pdf,.jpg,.jpeg,.png", helperText, file, onFileChange, error }: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) onFileChange(droppedFile);
  };

  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="form-label">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          dragOver
            ? "border-primary/50 bg-primary/5"
            : file
            ? "border-success/40 bg-success/5"
            : error
            ? "border-destructive/50 bg-destructive/5"
            : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
        }`}
        onClick={() => !file && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label={`Upload ${label}`}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
      >
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileCheck className="h-5 w-5 text-success" />
            <span className="text-sm font-medium text-foreground">{file.name}</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onFileChange(null); }}
              className="h-6 w-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
              aria-label="Remover ficheiro"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
              <Upload className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Arraste o ficheiro aqui ou clique para carregar</span>
            <span className="text-xs text-muted-foreground/70">PDF, JPG ou PNG · máx. 10MB</span>
          </div>
        )}
        <input
          ref={inputRef}
          id={name}
          name={name}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        />
      </div>
      {helperText && !error && <p className="helper-text">{helperText}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default FileUpload;
