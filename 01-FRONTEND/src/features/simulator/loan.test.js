import { describe, expect, it } from "vitest";
import { computeLoan, validateNumber } from "./loan.js";

// Régressions du portage : valeurs de référence du prototype validé (README phase 03 et PRD).
describe("computeLoan", () => {
  it("5 000 € sur 12 mois", () => {
    const r = computeLoan(5000, 12);
    expect(r.interest.toFixed(2)).toBe("350.00");
    expect(r.total.toFixed(2)).toBe("5350.00");
    expect(r.monthly.toFixed(2)).toBe("445.83");
  });
  it("15 000 € sur 72 mois", () => {
    expect(computeLoan(15000, 72).monthly.toFixed(2)).toBe("295.83");
  });
});

describe("validateNumber", () => {
  it("accepte les valeurs valides", () => {
    expect(validateNumber("5000", "amount")).toBe("");
    expect(validateNumber("72", "months")).toBe("");
  });
  it("refuse vide, non numérique, hors bornes, pas de 500, durée non entière", () => {
    expect(validateNumber("", "amount")).not.toBe("");
    expect(validateNumber("abc", "amount")).not.toBe("");
    expect(validateNumber("4500", "amount")).not.toBe("");
    expect(validateNumber("5250", "amount")).not.toBe("");
    expect(validateNumber("12,5", "months")).not.toBe("");
    expect(validateNumber("73", "months")).not.toBe("");
  });
});
