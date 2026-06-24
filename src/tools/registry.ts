import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import {
  Binary,
  Braces,
  Clock3,
  Fingerprint,
  Hash,
  KeyRound,
  Link2,
  type LucideIcon,
  Regex,
} from "lucide-react";

export type Tool = {
  id: string;
  title: string;
  category: string;
  description: string;
  aliases: string[];
  route: string;
  icon: LucideIcon;
  component: LazyExoticComponent<ComponentType>;
};

export const tools: Tool[] = [
  {
    id: "regex101",
    title: "Regex101",
    category: "Reference",
    description: "Open regex101 for multi-flavor regex testing and explanations.",
    aliases: ["regex", "regexp", "regular expression", "python regex", "go regex"],
    route: "/regex",
    icon: Regex,
    component: lazy(() => import("./regex/RegexTool")),
  },
  {
    id: "base64",
    title: "Base64",
    category: "Encoders",
    description: "Encode and decode Base64 text.",
    aliases: ["b64", "encode", "decode"],
    route: "/base64",
    icon: Binary,
    component: lazy(() => import("./base64/Base64Tool")),
  },
  {
    id: "url",
    title: "URL",
    category: "Encoders",
    description: "Encode and decode URL components.",
    aliases: ["uri", "percent", "escape", "unescape"],
    route: "/url",
    icon: Link2,
    component: lazy(() => import("./url/UrlTool")),
  },
  {
    id: "json",
    title: "JSON",
    category: "Formatters",
    description: "Validate, format, and minify JSON.",
    aliases: ["pretty", "format", "minify", "validate"],
    route: "/json",
    icon: Braces,
    component: lazy(() => import("./json/JsonTool")),
  },
  {
    id: "timestamp",
    title: "Time",
    category: "Time",
    description: "Parse log times and compare them across time zones.",
    aliases: ["unix", "epoch", "date", "timezone", "tz", "world time"],
    route: "/timestamp",
    icon: Clock3,
    component: lazy(() => import("./time/TimestampTool")),
  },
  {
    id: "uuid",
    title: "UUID",
    category: "Generators",
    description: "Generate UUID values locally.",
    aliases: ["guid", "random id"],
    route: "/uuid",
    icon: Fingerprint,
    component: lazy(() => import("./uuid/UuidTool")),
  },
  {
    id: "hash",
    title: "Hash",
    category: "Crypto",
    description: "Generate SHA hashes with Web Crypto.",
    aliases: ["sha", "digest", "checksum"],
    route: "/hash",
    icon: Hash,
    component: lazy(() => import("./hash/HashTool")),
  },
  {
    id: "jwt",
    title: "JWT",
    category: "Crypto",
    description: "Decode JWT header and payload without verification.",
    aliases: ["token", "claims", "decode jwt"],
    route: "/jwt",
    icon: KeyRound,
    component: lazy(() => import("./jwt/JwtTool")),
  },
];
