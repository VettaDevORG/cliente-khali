/**
 * Spanish tax ids: NIF (8 digits + letter), NIE (X/Y/Z + 7 digits + letter) and CIF (letter + 7 digits + control).
 * Only the control character is checked; a real id with a typo fails here, which is what we want before publishing it
 * in an aviso legal.
 */
const NIF_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";
const CIF_LETTERS = "JABCDEFGHI";

export function normalizeTaxId(raw: string): string {
  return raw.replace(/[\s.-]/g, "").toUpperCase();
}

export function isValidTaxId(raw: string): boolean {
  const id = normalizeTaxId(raw);
  if (/^\d{8}[A-Z]$/.test(id)) return NIF_LETTERS[Number(id.slice(0, 8)) % 23] === id[8];
  if (/^[XYZ]\d{7}[A-Z]$/.test(id)) {
    const digits = `${"XYZ".indexOf(id[0])}${id.slice(1, 8)}`;
    return NIF_LETTERS[Number(digits) % 23] === id[8];
  }
  if (/^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/.test(id)) {
    const digits = id.slice(1, 8).split("").map(Number);
    let sum = 0;
    digits.forEach((d, i) => {
      if (i % 2 === 1) sum += d;
      else {
        const twice = d * 2;
        sum += Math.floor(twice / 10) + (twice % 10);
      }
    });
    const control = (10 - (sum % 10)) % 10;
    const expectedLetter = CIF_LETTERS[control];
    const expectedDigit = String(control);
    const given = id[8];
    // Entities whose control is always a letter, and those whose control is always a digit.
    if ("PQRSNW".includes(id[0])) return given === expectedLetter;
    if ("ABEH".includes(id[0])) return given === expectedDigit;
    return given === expectedLetter || given === expectedDigit;
  }
  return false;
}
