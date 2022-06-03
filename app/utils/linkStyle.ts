export type ButtonVariant =
  | "brand"
  | "primary"
  | "secondary"
  | "accent"
  | "inverted";

const baseClasses =
  "border-2 inline-flex items-center justify-center rounded-lg px-8 py-1 font-semibold hover:opacity-80 disabled:opacity-50";

const classesByVariant = {
  brand: "bg-light-interactive border-light-interactive text-white",
  primary:
    "bg-light-interactive-fill border-light-interactive-fill text-indigo-500",
  secondary: "bg-transparent border-indigo-500 text-indigo-500",
  accent: "bg-brand-highlight border-brand-highlight text-black-500",
  inverted: "bg-transparent border-white text-white",
};

export function buttonStyle(variant: ButtonVariant) {
  return baseClasses + " " + classesByVariant[variant];
}
