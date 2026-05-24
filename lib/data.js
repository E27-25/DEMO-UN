export const VAULT_DOCS = [
  { id: 'laos-edp-2017',          flag: '🇱🇦', country: 'Laos',        title: 'Law on Electronic Data Protection',      year: 2017, lang: 'Lao/EN' },
  { id: 'laos-ecommerce-2022',    flag: '🇱🇦', country: 'Laos',        title: 'E-Commerce Promotion Law',               year: 2022, lang: 'Lao/EN' },
  { id: 'cambodia-ecommerce-2019',flag: '🇰🇭', country: 'Cambodia',    title: 'Law on E-Commerce',                      year: 2019, lang: 'Khmer/EN' },
  { id: 'cambodia-prakas-2021',   flag: '🇰🇭', country: 'Cambodia',    title: 'Prakas on Data Privacy',                 year: 2021, lang: 'Khmer/EN' },
  { id: 'myanmar-pdp-2021',       flag: '🇲🇲', country: 'Myanmar',     title: 'Personal Data Protection Law',           year: 2021, lang: 'Burmese/EN' },
  { id: 'thailand-pdpa-2019',     flag: '🇹🇭', country: 'Thailand',    title: 'Personal Data Protection Act (PDPA)',    year: 2019, lang: 'Thai/EN' },
  { id: 'vietnam-cybersec-2018',  flag: '🇻🇳', country: 'Vietnam',     title: 'Law on Cybersecurity',                   year: 2018, lang: 'Vietnamese/EN' },
  { id: 'indonesia-pdp-2022',     flag: '🇮🇩', country: 'Indonesia',   title: 'Personal Data Protection Law',           year: 2022, lang: 'Indonesian/EN' },
  { id: 'philippines-dpa-2012',   flag: '🇵🇭', country: 'Philippines', title: 'Data Privacy Act',                       year: 2012, lang: 'Filipino/EN' },
  { id: 'singapore-pdpa-2012',    flag: '🇸🇬', country: 'Singapore',   title: 'Personal Data Protection Act (PDPA)',    year: 2012, lang: 'EN' },
  { id: 'malaysia-pdpa-2010',     flag: '🇲🇾', country: 'Malaysia',    title: 'Personal Data Protection Act',          year: 2010, lang: 'Malay/EN' },
];

export const MOCK_LAWS = {
  'laos-edp-2017': `Article 1: This Law governs the collection, use, storage, and transfer of electronic personal data within the Lao People's Democratic Republic.

Article 12: Personal data may be transferred outside the Lao PDR only upon explicit written consent of the data subject, or where the destination country has been assessed by the Ministry of Technology and Communications as providing an adequate level of protection equivalent to this Law.

Article 15: All data controllers operating within the territory of Lao PDR shall register with the designated national authority within 90 days of commencing operations involving personal data.

Article 23: The Ministry of Technology and Communications shall establish a national data protection registry and publish annual compliance reports.

Article 31: Data subjects shall have the right to access their personal data held by any data controller and to request corrections where inaccurate data has been recorded.`,

  'laos-ecommerce-2022': `Article 3: Electronic commerce transactions conducted within or directed at the Lao PDR shall be governed by the laws of the Lao People's Democratic Republic.

Article 8: Service providers engaged in cross-border electronic commerce shall ensure that consumer transaction records are maintained and accessible to Lao regulatory authorities upon request.

Article 19: No transfer of commercial transaction data to servers outside the territory of the Lao PDR shall be permitted without prior authorization from the Ministry of Industry and Commerce.

Article 24: Digital payment service providers shall obtain a license from the Bank of the Lao PDR and maintain transaction logs for a minimum period of five years.

Article 33: Consumers engaged in cross-border e-commerce shall be entitled to dispute resolution mechanisms under Lao jurisdiction.`,

  'cambodia-ecommerce-2019': `Article 34: Cross-border electronic transactions shall be subject to the laws of the Kingdom of Cambodia where the consumer is domiciled. Service providers shall not transfer consumer transaction data to servers located outside ASEAN member states without prior notification to the Telecommunication Regulator of Cambodia.

Article 41: The Ministry of Posts and Telecommunications shall establish a national certification authority for digital signatures.

Article 55: Any data breach affecting more than 1,000 individuals shall be reported to the Telecommunication Regulator within 72 hours of discovery.

Article 78: Platform operators facilitating cross-border trade shall maintain a local representative and registered office within the Kingdom of Cambodia.`,

  'cambodia-prakas-2021': `Article 2: This Prakas establishes minimum standards for the collection, processing, and protection of personal data by all data processors operating within the Kingdom of Cambodia.

Article 7: Data controllers shall obtain freely given, specific, and informed consent from data subjects prior to collecting or processing their personal data.

Article 13: Personal data shall not be retained beyond the period necessary for the purpose for which it was collected unless required by applicable law or court order.

Article 19: The Telecommunication Regulator of Cambodia shall investigate complaints and may impose administrative penalties not exceeding USD 25,000 per violation.

Article 25: Data subjects shall have the right to withdraw consent at any time without affecting the lawfulness of prior processing.`,

  'myanmar-pdp-2021': `Section 18: A data controller shall not transfer personal data to a foreign country or international organization unless that country or organization ensures an adequate level of personal data protection equivalent to this Law.

Section 22: Every organization collecting personal data from more than 10,000 individuals shall appoint a Data Protection Officer and submit annual compliance reports to the Personal Data Protection Commission.

Section 31: Individuals shall have the right to access, correct, and request deletion of their personal data held by any data controller registered under this Law.

Section 45: The Personal Data Protection Commission shall be established as an independent body with authority to investigate complaints, conduct audits, and impose administrative sanctions.

Section 52: Data controllers shall implement appropriate technical and organizational measures including encryption, access controls, and regular security assessments.`,

  'thailand-pdpa-2019': `มาตรา 28: ห้ามมิให้ผู้ควบคุมข้อมูลส่วนบุคคลโอนข้อมูลส่วนบุคคลไปยังต่างประเทศ เว้นแต่ประเทศปลายทางมีมาตรฐานการคุ้มครองข้อมูลส่วนบุคคลที่เพียงพอตามที่คณะกรรมการกำหนด

Section 28: A data controller shall not transfer personal data to a foreign country unless the destination country has adequate personal data protection standards as determined by the PDPC.

Section 37: The Personal Data Protection Committee shall be established as an independent supervisory body with authority to investigate complaints, impose administrative fines up to 5 million THB, and issue binding orders.

Section 41: Data controllers must notify the PDPC and affected individuals within 72 hours of becoming aware of a personal data breach that poses risk of harm.

Section 53: Data subjects shall have the right to data portability in a structured, commonly used, and machine-readable format.`,

  'vietnam-cybersec-2018': `Article 26: Domestic and foreign enterprises providing services on telecommunications networks or the internet in Vietnam that collect, exploit, analyze, and process personal data of Vietnamese users must store such data in Vietnam for a period of time stipulated by the Government. Enterprises that place servers in Vietnam must provide information to competent authorities.

Article 17: Cybersecurity protection departments shall be responsible for receiving and verifying information regarding acts that violate the law on cybersecurity.

Article 32: Personal information protection on cyberspace shall ensure the rights and legitimate interests of organizations and individuals.

Article 38: Organizations and individuals using cyberspace shall have the right to protection of personal information.`,

  'indonesia-pdp-2022': `Article 5: Personal Data Subjects shall have rights to obtain information on clarity of identity, legal basis, purpose, and use of Personal Data.

Article 14: Transfer of Personal Data to other countries shall require the existence of personal data protection regulations in the destination country that are equivalent to or higher than the provisions of this Law.

Article 24: Personal Data Controllers shall appoint a Personal Data Protection Officer if the processing activity requires systematic and large-scale monitoring of Personal Data Subjects.

Article 46: The supervisory body shall be an independent government institution that carries out the function of overseeing the implementation of personal data protection.

Article 65: Personal Data Controllers must notify Personal Data Subjects and the supervisory body within 14 days of discovering a Personal Data breach.`,

  'philippines-dpa-2012': `Section 11: Processing of personal information shall be allowed subject to adherence to the principles of transparency, legitimate purpose, and proportionality.

Section 13: The processing of sensitive personal information shall be prohibited except in specific circumstances including consent of the data subject.

Section 16: A data subject shall have the right to be informed, object, access, rectify, erase or block, indemnification, and data portability.

Section 20: Each personal information controller must designate an individual who functions as data protection officer to be accountable for the entity's compliance.

Section 38: The National Privacy Commission shall administer and implement the provisions of this Act and monitor compliance with international standards for data protection.`,

  'singapore-pdpa-2012': `Section 26: An organisation shall not transfer personal data to a country or territory outside Singapore except in accordance with requirements prescribed under this Act to ensure that organisations provide a standard of protection to personal data so transferred that is comparable to the protection under this Act.

Section 11: An organisation shall designate one or more individuals to be responsible for ensuring that the organisation complies with this Act. The business contact information of the designated individual(s) shall be made available to the public.

Section 24: An organisation shall protect personal data in its possession or under its control by making reasonable security arrangements to prevent unauthorised access, collection, use, disclosure, copying, modification, disposal, or similar risks.

Section 26D: An organisation that suffers a notifiable data breach shall notify the Commission and each affected individual as soon as practicable. A breach is notifiable if it results in or is likely to result in significant harm to affected individuals.`,

  'malaysia-pdpa-2010': `Section 8: A data user shall not transfer any personal data of a data subject to a place outside Malaysia unless to such places as specified by the Minister.

Section 5: The principles governing the processing of personal data in Malaysia are: General Principle, Notice and Choice Principle, Disclosure Principle, Security Principle, Retention Principle, Data Integrity Principle, and Access Principle.

Section 30: Every data user shall take practical steps to protect personal data from any loss, misuse, modification, unauthorised or accidental access or disclosure, alteration or destruction.

Section 43: A data subject shall be entitled to access personal data about himself and to request correction of inaccurate, incomplete, misleading or not up-to-date personal data.`,
};

export const INDICATORS = [
  { id: '6.1', name: 'Free flow of data',         pillar: 6 },
  { id: '6.2', name: 'Data localization',          pillar: 6 },
  { id: '6.3', name: 'Government access',          pillar: 6 },
  { id: '6.4', name: 'Conditional flows',          pillar: 6 },
  { id: '6.5', name: 'Sector-specific rules',      pillar: 6 },
  { id: '6.6', name: 'Intl. framework',            pillar: 6 },
  { id: '7.1', name: 'DP legislation',             pillar: 7 },
  { id: '7.2', name: 'Supervisory authority',      pillar: 7 },
  { id: '7.3', name: 'Individual rights',          pillar: 7 },
  { id: '7.4', name: 'Breach notification',        pillar: 7 },
];

// rows = countries, cols = indicators [6.1,6.2,6.3,6.4,6.5,6.6,7.1,7.2,7.3,7.4]
export const COVERAGE = {
  Singapore:   [80, 75, 85, 90, 70, 88, 95, 92, 94, 96],
  Thailand:    [72, 68, 78, 88, 62, 55, 93, 90, 89, 91],
  Philippines: [65, 60, 70, 75, 58, 50, 90, 85, 87, 78],
  Indonesia:   [60, 72, 65, 80, 55, 45, 88, 82, 80, 75],
  Malaysia:    [58, 65, 60, 70, 52, 40, 85, 78, 82, 70],
  Vietnam:     [55, 90, 80, 60, 65, 30, 75, 68, 65, 60],
  Cambodia:    [50, 58, 55, 65, 45, 25, 70, 62, 68, 72],
  Laos:        [40, 52, 48, 70, 38, 20, 68, 55, 60, 58],
  Myanmar:     [35, 45, 42, 62, 30, 15, 62, 58, 65, 48],
};

export const COUNTRY_STATS = [
  { flag: '🇸🇬', country: 'Singapore',   laws: 1, indicators: 9, verified: 92, score: 91, color: '#10B981' },
  { flag: '🇹🇭', country: 'Thailand',    laws: 1, indicators: 9, verified: 88, score: 87, color: '#10B981' },
  { flag: '🇵🇭', country: 'Philippines', laws: 1, indicators: 8, verified: 79, score: 78, color: '#10B981' },
  { flag: '🇮🇩', country: 'Indonesia',   laws: 1, indicators: 8, verified: 83, score: 75, color: '#10B981' },
  { flag: '🇲🇾', country: 'Malaysia',    laws: 1, indicators: 7, verified: 76, score: 73, color: '#F59E0B' },
  { flag: '🇻🇳', country: 'Vietnam',     laws: 1, indicators: 6, verified: 71, score: 68, color: '#F59E0B' },
  { flag: '🇰🇭', country: 'Cambodia',    laws: 2, indicators: 6, verified: 73, score: 65, color: '#F59E0B' },
  { flag: '🇱🇦', country: 'Laos',        laws: 2, indicators: 5, verified: 62, score: 60, color: '#EF4444' },
  { flag: '🇲🇲', country: 'Myanmar',     laws: 1, indicators: 4, verified: 52, score: 44, color: '#EF4444' },
];

export const CHART_DATA = INDICATORS.map((ind, i) => ({
  id: ind.id,
  name: ind.name,
  pillar: ind.pillar,
  laws: Object.values(COVERAGE).filter(c => c[i] > 40).length,
  conf: Math.round(Object.values(COVERAGE).reduce((a, c) => a + c[i], 0) / Object.keys(COVERAGE).length),
}));

export const RECENT_VERIFICATIONS = [
  { flag: '🇸🇬', country: 'Singapore', law: 'PDPA 2012',                       ind: '7.4', action: 'Human Verified', ts: 'just now' },
  { flag: '🇹🇭', country: 'Thailand',  law: 'PDPA 2019',                       ind: '7.2', action: 'Human Verified', ts: '3 min ago' },
  { flag: '🇱🇦', country: 'Laos',      law: 'Electronic Data Protection 2017', ind: '6.4', action: 'Human Verified', ts: '9 min ago' },
  { flag: '🇰🇭', country: 'Cambodia',  law: 'Law on E-Commerce 2019',          ind: '7.4', action: 'AI Draft',       ts: '16 min ago' },
  { flag: '🇲🇲', country: 'Myanmar',   law: 'PDPL 2021',                       ind: '7.3', action: 'Human Verified', ts: '24 min ago' },
  { flag: '🇻🇳', country: 'Vietnam',   law: 'Law on Cybersecurity 2018',       ind: '6.2', action: 'Human Verified', ts: '38 min ago' },
  { flag: '🇮🇩', country: 'Indonesia', law: 'PDP Law 2022',                    ind: '6.4', action: 'AI Draft',       ts: '52 min ago' },
];

export const confColor = v => v >= 75 ? '#10B981' : v >= 50 ? '#F59E0B' : '#EF4444';
export const cellBg    = v => {
  if (v >= 80) return 'rgba(16,185,129,0.22)';
  if (v >= 60) return 'rgba(16,185,129,0.1)';
  if (v >= 40) return 'rgba(245,158,11,0.12)';
  if (v > 0)   return 'rgba(239,68,68,0.1)';
  return 'rgba(255,255,255,0.03)';
};
export const cellTxt = v =>
  v >= 80 ? '#34D399' : v >= 60 ? '#A7F3D0' : v >= 40 ? '#FDE68A' : v > 0 ? '#FCA5A5' : '#334155';
