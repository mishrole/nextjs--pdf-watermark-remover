import fs from "fs";

export const dump = (dumpBody: any) => {
  fs.writeFile(`./dump.json`, dumpBody, "utf8", (err) => {
    if (err) {
      console.log(`Error writing file: ${err}`);
    } else {
      console.log(`File is written successfully!`);
    }
  });
};

export const dumpSync = (dumpBody: any, fileType: string = "txt") => {
  const directoryPath = "./dumps";

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  const fileName = `./dump-${new Date()
    .toISOString()
    .replace(/[:.]/g, "-")}.${fileType}`;
  const filePath = `${directoryPath}/${fileName}`;

  fs.writeFileSync(filePath, dumpBody);
};
