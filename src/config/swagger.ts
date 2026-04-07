import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

export function loadOpenApiSpec() {
  const filePath = path.join(process.cwd(), "src", "docs", "openapi.yaml");
  const file = fs.readFileSync(filePath, "utf8");
  return YAML.parse(file);
}
