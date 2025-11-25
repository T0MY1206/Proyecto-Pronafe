interface FormLabelProps {
    name: string;
    label: string;
}

export default function ({ name, label }: FormLabelProps) {
    return <label htmlFor={name} className="form-label block text-sm font-medium text-slate-700 mb-2">{label}</label>
}
