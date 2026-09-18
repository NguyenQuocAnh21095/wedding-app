const TOXICITY_SEVERITY = ["I", "II", "III", "IV"] as const;

export function summarizeSafety(items: { medicine: { phiDays: number | null; toxicityClass: string | null } }[]) {
  const phiValues = items.map((i) => i.medicine.phiDays).filter((v): v is number => v != null);
  const maxPhiDays = phiValues.length > 0 ? Math.max(...phiValues) : null;

  const toxicityClasses = items.map((i) => i.medicine.toxicityClass).filter((v): v is string => v != null);
  let mostSevereToxicity: string | null = null;
  for (const level of TOXICITY_SEVERITY) {
    if (toxicityClasses.includes(level)) {
      mostSevereToxicity = level;
      break;
    }
  }

  return { maxPhiDays, mostSevereToxicity };
}
