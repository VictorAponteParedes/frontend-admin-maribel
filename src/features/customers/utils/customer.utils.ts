export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const digits = cleanPhoneNumber(phone);
  return digits.length >= 7;
};

export const buildCustomerWhatsAppUrl = (phone: string): string => {
  const clean = cleanPhoneNumber(phone);
  const normalizedNumber = clean.replace(/^0+/, '');
  return `https://wa.me/595${normalizedNumber}`;
};
