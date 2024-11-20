interface MtlMaterial {
  name: string;
  Ka?: number[];
  Kd?: number[];
  Ks?: number[];
}

export function parseMtl(content: string): MtlMaterial[] {
  const materials: MtlMaterial[] = [];
  let currentMaterial: MtlMaterial | null = null;

  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const [command, ...args] = trimmed.split(/\s+/);
    const argString = args.join(" ");

    if (command === "newmtl") {
      if (currentMaterial) materials.push(currentMaterial);
      currentMaterial = { name: argString };
    }

    if (currentMaterial) {
      if (command === "Ka") {
        currentMaterial.Ka = args.map((v) => Number(v));
      } else if (command === "Kd") {
        currentMaterial.Kd = args.map((v) => Number(v));
      } else if (command === "Ks") {
        currentMaterial.Ks = args.map((v) => Number(v));
      }
    }
  });

  if (currentMaterial) materials.push(currentMaterial);

  return materials;
}
