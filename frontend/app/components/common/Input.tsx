interface InputProps {
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
}

const Input = ({ className, value, onChange, placeholder, type = "text" }: InputProps) => (
  <input className={className} type={type} value={value} onChange={onChange} placeholder={placeholder} style={{ padding: "8px", margin: "5px", width: "200px" }} />
);

export default Input;