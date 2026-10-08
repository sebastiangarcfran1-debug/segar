export const CONTACT_INFO = {
  brandName: 'SEGAR AI MARKETING',
  whatsappDisplay: '+56 9 91842110',
  whatsappRaw: '56991842110',
  email: 'operaciones.segar.ant@gmail.com',
  transferencia: {
    destinatario: 'Segar AI Marketing',
    rut: '28800081-6',
    banco: 'Copec Pay',
    tipoCuenta: 'Cuenta Vista',
    numeroCuenta: '12880008101',
    emailComprobante: 'operaciones.segar.ant@gmail.com',
  },
  getWhatsAppUrl(mensaje: string) {
    return `https://wa.me/56991842110?text=${encodeURIComponent(mensaje)}`;
  },
};
