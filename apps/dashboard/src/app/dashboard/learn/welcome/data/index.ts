import nurseryModules from "./nurseryModules";
import gearModules from "./gearModules";
import postpartumModules from "./postpartumModules";
import type { StaticAcademyModule } from "./types";

export const categories = [
  { id: "Nursery", label: "Nursery", modules: nurseryModules },
  { id: "Gear", label: "Gear", modules: gearModules },
  { id: "Postpartum", label: "Postpartum", modules: postpartumModules },
] as const;

export type StaticModuleCategory = (typeof categories)[number]["id"];

export const allModules: StaticAcademyModule[] = [
  ...nurseryModules,
  ...gearModules,
  ...postpartumModules,
];

export { nurseryModules, gearModules, postpartumModules };
