interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const Button = ({ onClick, children, disabled }: ButtonProps) => (
  <button onClick={onClick} disabled={disabled} style={{ padding: "10px 20px", margin: "5px" }}>
		{children}
  </button>
);

export default Button;