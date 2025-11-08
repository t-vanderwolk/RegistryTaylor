"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postpartumModules = exports.gearModules = exports.nurseryModules = exports.allModules = exports.categories = void 0;
const nurseryModules_1 = __importDefault(require("./nurseryModules"));
exports.nurseryModules = nurseryModules_1.default;
const gearModules_1 = __importDefault(require("./gearModules"));
exports.gearModules = gearModules_1.default;
const postpartumModules_1 = __importDefault(require("./postpartumModules"));
exports.postpartumModules = postpartumModules_1.default;
exports.categories = [
    { id: "Nursery", label: "Nursery", modules: nurseryModules_1.default },
    { id: "Gear", label: "Gear", modules: gearModules_1.default },
    { id: "Postpartum", label: "Postpartum", modules: postpartumModules_1.default },
];
exports.allModules = [
    ...nurseryModules_1.default,
    ...gearModules_1.default,
    ...postpartumModules_1.default,
];
