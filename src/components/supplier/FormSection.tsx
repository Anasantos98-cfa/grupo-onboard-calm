interface FormSectionProps {
  title: string;
  helperText?: string;
  children: React.ReactNode;
}

const FormSection = ({ title, helperText, children }: FormSectionProps) => {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="section-title">{title}</h2>
        {helperText && <p className="helper-text mt-1">{helperText}</p>}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
