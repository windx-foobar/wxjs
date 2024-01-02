export function useCertificatesUtils() {
  enum PREDEFINED_PREFIXES {
    LK = 'LK'
  }

  const generateCertificateNumber = (prefix: string, number?: string) => {
    const stamp = `${Date.now()}`;

    let _number: string;
    if (!number) {
      _number = stamp.slice(-5);
    } else {
      _number = number.length > 5 ? number.slice(0, 5) : `${number}${stamp.slice(-5 + number.length)}`;
    }

    return `${prefix}-${_number}`;
  };

  return { generateCertificateNumber, PREDEFINED_PREFIXES };
}
