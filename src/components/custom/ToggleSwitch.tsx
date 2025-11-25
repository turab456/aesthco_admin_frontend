import React from "react";

type ToggleSwitchProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  description?: string;
  disabled?: boolean;
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  checked,
  onChange,
  description,
  disabled = false,
}) => {
  return (
    <label className="flex w-full items-start gap-3">
      <div className="flex h-10 items-center">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            checked ? "bg-gray-900" : "bg-gray-200"
          } ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
              checked ? "translate-x-5" : "translate-x-1"
            }`}
          />
        </button>
      </div>
      <div className="flex flex-1 flex-col">
        <span
          className={`text-sm font-semibold ${
            disabled ? "text-gray-400" : "text-gray-900"
          }`}
        >
          {label}
        </span>
        {description && (
          <span className="text-xs text-gray-500">{description}</span>
        )}
      </div>
    </label>
  );
};

export default ToggleSwitch;
