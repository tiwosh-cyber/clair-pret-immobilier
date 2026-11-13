import { describe, expect, it } from "vitest";
import { computeLoan, euro, toNumber, validateNumber } from "./loan.js";

// Espaces insécables produits par Intl en fr-FR → espace simple pour comparer.
const plain = (s) => s.replace(/[\u00a0\u202f]/g, " ");

describe("TEST-001 AC-003 — intérêts simples à 7 %", () => {
  it("5 000 € sur 12 mois (référence PRD)", () => {
    const r = computeLoan(5000, 12);
    expect(r.interest).toBeCloseTo(350, 10);
    expect(r.total).toBeCloseTo(5350, 10);
    expect(r.monthly).toBeCloseTo(5350 / 12, 10);
  });
  it("15 000 € sur 72 mois", () => {
    const r = computeLoan(15000, 72);
    expect(r.interest).toBeCloseTo(6300, 10);
    expect(r.monthly.toFixed(2)).toBe("295.83");
  });
  it("aucun arrondi intermédiaire : mensualité × durée = total exact", () => {
    for (const [c, n] of [[5000, 12], [7500, 37], [12500, 71], [15000, 72]]) {
      const r = computeLoan(c, n);
      expect(r.monthly * n).toBeCloseTo(r.total, 9);
      expect(r.total).toBeCloseTo(c * (1 + 0.07 * n / 12), 9);
    }
  });
});

describe("TEST-002 AC-004 — affichage à deux décimales", () => {
  it("formate en euros fr-FR", () => {
    expect(plain(euro(5350 / 12))).toBe("445,83 €");
    expect(plain(euro(350))).toBe("350,00 €");
    expect(plain(euro(5350))).toBe("5 350,00 €");
  });
});

describe("TEST-003 AC-001 / AC-002 — saisies valides", () => {
  it.each([
    ["5000", "amount"], ["15000", "amount"], ["10500", "amount"], [" 5000 ", "amount"], ["5000,0", "amount"],
    ["12", "months"], ["72", "months"], ["37", "months"], ["12.0", "months"],
  ])("%s (%s) accepté", (raw, kind) => expect(validateNumber(raw, kind)).toBe(""));
  it("virgule décimale convertie", () => expect(toNumber("5000,0")).toBe(5000));
});

describe("TEST-004 AC-006 — saisies refusées avec message", () => {
  it.each([
    ["", "amount", "Renseignez"], ["   ", "months", "Renseignez"],
    ["abc", "amount", "numérique"], ["-5000", "amount", "numérique"], ["1e4", "amount", "numérique"],
    ["0x1388", "amount", "numérique"], ["Infinity", "amount", "numérique"], ["5 000", "amount", "numérique"],
    ["4500", "amount", "compris entre"], ["15500", "amount", "compris entre"], ["99999999999999999999", "amount", "compris entre"],
    ["5250", "amount", "pas de 500"], ["5000.5", "amount", "pas de 500"],
    ["12,5", "months", "entier"], ["12.0000000000000001", "months", "entier"],
    ["5000.0000000000001", "amount", "pas de 500"], ["5,000.5", "amount", "numérique"], ["5000,", "amount", "numérique"],
    [",5", "amount", "numérique"], ["５０００", "amount", "numérique"], ["0", "months", "comprise entre"], ["11", "months", "comprise entre"], ["73", "months", "comprise entre"],
  ])("%j (%s) → « %s »", (raw, kind, msg) => expect(validateNumber(raw, kind)).toContain(msg));
});
