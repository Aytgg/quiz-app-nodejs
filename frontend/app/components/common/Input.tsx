interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
}

const Input = ({ value, onChange, placeholder, type = "text" }: InputProps) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{ padding: "8px", margin: "5px", width: "200px" }} />
);

export default Input;