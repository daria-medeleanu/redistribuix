export const FILTERS = ["All", "Available"];

export const NAV_ITEMS = [
  { id: "locations",    label: "Locations",       icon: "🏢" },
  { id: "products", label: "Products", icon: "📅" },
  { id: "profile",  label: "Profile",  icon: "👤" },
];

export function getInitials(name) {
  if (!name) return "U";

  const trimmed = name.trim();
  if (!trimmed) return "U";

  const parts = trimmed.split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  const first = parts[0][0] || "";
  const last = parts[parts.length - 1][0] || "";
  const initials = `${first}${last}`.toUpperCase();

  return initials || "U";
}