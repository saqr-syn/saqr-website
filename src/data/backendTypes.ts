export interface ProjectData {
  id?: string;
  slug?: string;
  name: string;
  short: string;
  description: string;
  developer: string;
  tools: string[];
  links: { website?: string; github?: string };
  status: "active" | "inactive" | "archived";
  type: "web" | "mobile";
  tags: string[];
  votes: { total: number; count: number; users: string[] };
  createdAt?: Date;
  updatedAt?: Date;
}
