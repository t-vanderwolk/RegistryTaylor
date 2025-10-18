import { baseConfig, buildWebOverrides, prettierConfigEntry } from "../../eslint.config.js";

const scopedWebOverrides = buildWebOverrides({ prefix: "" });

export default [...baseConfig, ...scopedWebOverrides, prettierConfigEntry];
