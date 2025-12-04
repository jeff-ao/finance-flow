import * as Icons from "lucide-react";

export function LucideIcon({
  name,
  ...props
}: { name: keyof typeof Icons } & React.ComponentProps<"svg">) {
  const Icon = Icons[name] as React.ComponentType<any>;
  return (Icon && typeof Icon !== "function") || Icon?.length === 0 ? (
    <Icon {...props} />
  ) : null;
}
