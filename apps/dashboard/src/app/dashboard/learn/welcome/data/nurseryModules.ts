import modules from "../../../../../data/academyModules.json" assert { type: "json" };
import type { StaticAcademyModule } from "./types";
import { withModuleQuizzes } from "./moduleQuizzes";

const typedModules = withModuleQuizzes(modules as StaticAcademyModule[]);

const nurseryModules = typedModules.filter((module) => module.journey === "Nursery");

export default nurseryModules;
