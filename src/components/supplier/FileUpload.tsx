import { Label } from "@/components/ui/label";
import { Upload, FileCheck } from "lucide-react";
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
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragOver ? "border-accent bg-accent/5" : file ? "border-success/50 bg-success/5" : error ? "border-destructive" : "border-border hover:border-accent/50"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label={`Upload ${label}`}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
      >
        {file ? (
          <div className="flex items-center justify-center gap-2 text-success">
            <FileCheck className="h-5 w-5" />
            <span className="text-sm font-medium">{file.name}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="h-5 w-5" />
            <span className="text-sm">Clique ou arraste o ficheiro aqui</span>
            <span className="text-xs">PDF, JPG ou PNG</span>
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
