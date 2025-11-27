import React from "react";

type ButtonVariant = "solid" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  style?: React.CSSProperties;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  fullWidth = true,
  style,
  variant = "solid",
  size = "md",
  isLoading = false,
}) => {
  const baseColor = "#1f2937"; // gray-800 to match sidebar
  const hoverColor = "#111827"; // gray-900
  const disabledColor = "#4b5563"; // gray-600
  const outlineHover = "rgba(17, 24, 39, 0.08)";

  const SIZE_STYLES: Record<ButtonSize, { padding: string; fontSize: string }> = {
    sm: { padding: "8px 14px", fontSize: "13px" },
    md: { padding: "12px 16px", fontSize: "14px" },
    lg: { padding: "14px 20px", fontSize: "15px" },
  };

  const isOutline = variant === "outline";
  const sizeStyles = SIZE_STYLES[size];

  const baseBackground = isOutline ? "transparent" : baseColor;
  const disabledBackground = isOutline ? "transparent" : disabledColor;
  const baseTextColor = isOutline ? baseColor : "#f9fafb";
  const disabledTextColor = isOutline ? "#9ca3af" : "#f3f4f6";
  const baseBorderColor = isOutline ? baseColor : "transparent";
  const disabledBorderColor = isOutline ? "#d1d5db" : "transparent";

  const isDisabled = disabled || isLoading;
  const currentBackground = isDisabled ? disabledBackground : baseBackground;
  const currentTextColor = isDisabled ? disabledTextColor : baseTextColor;
  const currentBorderColor = isDisabled ? disabledBorderColor : baseBorderColor;

  const hasCustomBackground = Boolean(style?.backgroundColor);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={className}
      style={{
        width: fullWidth ? "100%" : "auto",
        padding: sizeStyles.padding,
        backgroundColor: currentBackground,
        color: currentTextColor,
        border: `1px solid ${currentBorderColor}`,
        borderRadius: "8px",
        fontSize: sizeStyles.fontSize,
        fontWeight: "500",
        fontFamily: "Outfit, sans-serif",
        lineHeight: 1.2,
        cursor: isDisabled ? "not-allowed" : "pointer",
        transition: "background-color 0.2s ease, color 0.2s ease",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (isDisabled || hasCustomBackground) {
          return;
        }
        e.currentTarget.style.backgroundColor = isOutline
          ? outlineHover
          : hoverColor;
      }}
      onMouseLeave={(e) => {
        if (isDisabled || hasCustomBackground) {
          return;
        }
        e.currentTarget.style.backgroundColor = currentBackground;
      }}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

export default CustomButton;
