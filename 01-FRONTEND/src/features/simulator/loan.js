// Logique du simulateur reprise telle quelle du prototype validé (phase 03).
// Intérêts simples : I = C × 0,07 × N/12 ; T = C + I ; M = T/N. Aucun arrondi intermédiaire.
export const ANNUAL_RATE = 0.07;

export function computeLoan(amount, months) {
  const interest = amount * ANNUAL_RATE * (months / 12);
  const total = amount + interest;
  return { interest, total, monthly: total / months };
}

export function validateNumber(raw, kind) {
  if (raw.trim() === "") return "Renseignez une valeur.";
  if (!/^\d+(?:[.,]\d+)?$/.test(raw.trim()))
    return "Saisissez une valeur numérique valide.";
  const n = Number(raw.replace(",", "."));
  if (!Number.isFinite(n)) return "Saisissez une valeur numérique valide.";
  if (kind === "amount") {
    if (n < 5000 || n > 15000)
      return "Le montant doit être compris entre 5 000 et 15 000 €.";
    if (n % 500 !== 0) return "Choisissez un montant par pas de 500 €.";
  } else {
    if (!Number.isInteger(n))
      return "La durée doit être un nombre entier de mois.";
    if (n < 12 || n > 72)
      return "La durée doit être comprise entre 12 et 72 mois.";
  }
  return "";
}
