import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  size?: "xs" | "sm" | "md";
  variant?: "primary" | "secondary" | "outlined" | "danger";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const CustomButton: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  type = "button",
}) => {
  const sizeClasses = {
    xs: "px-3 py-1.5 text-xs",
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
  };

  const variantClasses = {
    primary: "bg-gray-800 text-white hover:bg-gray-900 disabled:bg-gray-400",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-300",
    outlined: "bg-transparent text-gray-800 border border-gray-500 hover:bg-gray-800 hover:text-white disabled:border-gray-400 disabled:text-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300",
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? "cursor-not-allowed" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default CustomButton;
