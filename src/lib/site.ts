export const SITE = {
  name: "Code Journey",
  url: "https://www.codejourney.space",
  tagline: "The map of tech careers",
  description:
    "Pick a tech role and see exactly which skills it needs, in what order, with the best official docs and free resources to learn each one.",
  gaId: "G-ZFFH1ZLHTY",
  email: "work.codejourney@gmail.com",
} as const;

export const THEMES = [
  { id: "harbor", name: "Harbor", colors: ["#F9F9F9", "#092634", "#004E72", "#FF6E42"], names: ["White", "Navy", "Blue", "Orange"] },
  { id: "juniper", name: "Juniper", colors: ["#EFE9D7", "#343723", "#898861", "#7D2826"], names: ["Candle", "Juniper", "Leaf", "Coral"] },
  { id: "tangerine", name: "Tangerine", colors: ["#FAF3E1", "#222222", "#F5E7C6", "#FF6D1F"], names: ["Linen", "Black Hole", "Cotton", "Tangerine"] },
  { id: "orchard", name: "Orchard", colors: ["#F5E6C5", "#3F422E", "#9F886F", "#D78B30"], names: ["Ivory", "Organic", "Natural", "Apricot"] },
] as const;
export type ThemeId = (typeof THEMES)[number]["id"];
export type Mode = "system" | "light" | "dark";
export const DEFAULT_THEME: ThemeId = "harbor";

export const RESOURCE_LABEL: Record<string, string> = {
  docs: "Docs",
  book: "Book",
  course: "Course",
  video: "Video",
  interactive: "Interactive",
  practice: "Practice",
  tool: "Tool",
  article: "Article",
  community: "Community",
};

export const STAGE_LEVEL = ["Foundations", "Core", "Job-ready", "Senior"];
