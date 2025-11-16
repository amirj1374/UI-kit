export class NationalCodeValidator {
  static isValid(nationalCode: string, customerType: 'Real' | 'Legal'): boolean {
    // Check length based on customer type
    if (customerType === 'Real' && !/^\d{10}$/.test(nationalCode)) return false;
    if (customerType === 'Legal' && !/^\d{11}$/.test(nationalCode)) return false;

    // For Legal customers, we only check the length and invalid patterns
    if (customerType === 'Legal') {
      const invalidCodes = [
        '00000000000', '11111111111', '22222222222', '33333333333',
        '44444444444', '55555555555', '66666666666', '77777777777',
        '88888888888', '99999999999'
      ];
      return !invalidCodes.includes(nationalCode);
    }

    // For Real customers, we do the full validation
    const invalidCodes = [
      '0000000000', '1111111111', '2222222222', '3333333333',
      '4444444444', '5555555555', '6666666666', '7777777777',
      '8888888888', '9999999999'
    ];
    if (invalidCodes.includes(nationalCode)) return false;

    // Calculate checksum for Real customers
    const digits = nationalCode.split('').map(Number);
    const check = digits[9];
    const sum = digits.slice(0, 9).reduce((acc, digit, index) => acc + digit * (10 - index), 0);
    const remainder = sum % 11;

    return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
  }
}
