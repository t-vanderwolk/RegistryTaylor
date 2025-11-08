"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const academyModules_json_1 = __importDefault(require("../../../../../data/academyModules.json"));
const typedModules = academyModules_json_1.default;
const nurseryModules = typedModules.filter((module) => module.journey === "Nursery");
exports.default = nurseryModules;
