import path from "path";
import fs from "fs";
import YAML from "yaml";

export function loadOpenApiSpec() {
  const filePath = path.join(process.cwd(), "src", "docs", "openapi.yaml");
  const file = fs.readFileSync(filePath, "utf8");
  return YAML.parse(file);
}
