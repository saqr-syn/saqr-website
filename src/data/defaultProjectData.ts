import { ProjectData } from "./types";

export const defaultProjectData: ProjectData = {
  name: "",
  short: "",
  description: "",
  developer: "",
  developerRole: "",
  teamSize: 1,
  vision: "",
  tools: [],
  links: { website: "" },      // رابط الموقع دايمًا موجود
  video: "",
  price: 0,
  paid: false,
  status: "active",
  type: "web",
  tags: [],
  screenshotHero: "",
  screenshots: [],
  challenges: [],
  solutions: [],
  features: [],
  stages: [],
  extraMetadata: {},
  createdAt: undefined,
  updatedAt: undefined,
};
