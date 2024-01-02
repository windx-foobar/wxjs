import { useModel } from '#wxjs/sequelize';

export default defineEventHandler(async (event) => {
  const Certificate = useModel(event, 'Certificate');
  const { generateCertificateNumber, PREDEFINED_PREFIXES } = useCertificatesUtils();

  const newCertificate = await Certificate.create({
    number: generateCertificateNumber(PREDEFINED_PREFIXES.LK)
  });

  return newCertificate;
});
