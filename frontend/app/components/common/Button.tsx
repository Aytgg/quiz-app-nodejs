interface ButtonProps {
  className?: string;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const Button = ({ className, onClick, children, disabled }: ButtonProps) => (
  <button className={className} onClick={onClick} disabled={disabled} style={{ padding: "10px 20px", margin: "5px" }}>
		{children}
  </button>
);

export default Button;