import { forwardRef } from "react";

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, id, className = "", ...props },
  ref,
) {
  const inputId = id ?? props.name;

  return (
    <div className="w-full">
      <div className="relative">
        <input
          id={inputId}
          ref={ref}
          placeholder=" "
          aria-invalid={error ? "true" : "false"}
          className={[
            "field-input peer w-full rounded-xl border bg-white px-4 pt-5 pb-2 text-[16px] text-ink lg:pt-[22px] lg:pb-2.5 lg:text-[17px]",
            "shadow-[0_1px_2px_rgba(16,24,40,0.05)] outline-none transition-colors",
            "focus:ring-2 focus:ring-black/5",
            error
              ? "border-red-400 focus:border-red-400"
              : "border-[#e6e8ec] focus:border-[#b8bdc6]",
            className,
          ].join(" ")}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={[
            "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-body text-[16px] text-gray-400 transition-all lg:text-[17px]",
            "peer-focus:top-[9px] peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-gray-500",
            "peer-[:not(:placeholder-shown)]:top-[9px] peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-gray-500",
          ].join(" ")}
        >
          {label}
        </label>
      </div>
      {error ? (
        <p className="mt-1.5 pl-1 text-[12px] text-red-500">{error}</p>
      ) : null}
    </div>
  );
});
