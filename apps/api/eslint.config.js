import { baseConfig, buildApiOverrides, prettierConfigEntry } from "../../eslint.config.js";

const scopedApiOverrides = buildApiOverrides({ prefix: "" });

export default [...baseConfig, ...scopedApiOverrides, prettierConfigEntry];
