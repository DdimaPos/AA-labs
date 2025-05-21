import fs from "node:fs";
import path from "node:path";

export function writeData(algName, width, depth, data) {
  const dir = './output';
  const filePath = path.join(dir, `${width}_${depth}_${algName}.txt`);

  // Ensure the directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write the data (will overwrite if file exists)
  fs.writeFileSync(filePath, data, "utf-8");
}
