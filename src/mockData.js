export const TIME_ZONE_LABEL = '(ET)';
export const TIME_ZONE_NAME = 'America/New_York';

export const SERVICE_CATEGORIES = [
  {
    id: 'injectables',
    name: 'Injectables',
    services: [
      { id: 'botox', name: 'Botox', duration: 30, price: 480, consultRequired: true, inPersonOnlyConsult: false },
      { id: 'filler', name: 'Dermal Filler', duration: 45, price: 700, consultRequired: true, inPersonOnlyConsult: false },
      { id: 'sculptra', name: 'Sculptra', duration: 45, price: 850, consultRequired: true, inPersonOnlyConsult: true },
    ],
  },
  {
    id: 'skin',
    name: 'Skin Treatments',
    services: [
      { id: 'microneedling', name: 'Microneedling', duration: 60, price: 400, consultRequired: true, inPersonOnlyConsult: false },
      { id: 'hydrafacial', name: 'HydraFacial', duration: 60, price: 200, consultRequired: false, inPersonOnlyConsult: false },
      { id: 'chemical-peel', name: 'Chemical Peel', duration: 45, price: 250, consultRequired: true, inPersonOnlyConsult: false },
      { id: 'diamond-glow', name: 'Diamond Glow Facial', duration: 45, price: 250, consultRequired: false, inPersonOnlyConsult: false },
    ],
  },
  {
    id: 'hair-body',
    name: 'Hair & Body',
    services: [
      { id: 'laser-hair', name: 'Laser Hair Removal Session', duration: 30, price: 200, consultRequired: true, inPersonOnlyConsult: true },
      { id: 'prp', name: 'PRP / Hair Restoration', duration: 60, price: 900, consultRequired: true, inPersonOnlyConsult: true },
      { id: 'coolsculpting', name: 'CoolSculpting', duration: 60, price: 750, consultRequired: true, inPersonOnlyConsult: true },
    ],
  },
  {
    id: 'wellness',
    name: 'Wellness',
    services: [
      { id: 'iv-therapy', name: 'IV Therapy Drip', duration: 45, price: 175, consultRequired: false, inPersonOnlyConsult: false },
      { id: 'b12', name: 'Vitamin B12 Injection', duration: 15, price: 50, consultRequired: false, inPersonOnlyConsult: false },
    ],
  },
];

export const SERVICES = SERVICE_CATEGORIES.flatMap((c) =>
  c.services.map((s) => ({ ...s, categoryId: c.id, categoryName: c.name }))
);

export function findServiceById(id) {
  return SERVICES.find((s) => s.id === id);
}

export const SERIES_PACKAGES = [
  {
    id: 'laser-hair-6',
    serviceId: 'laser-hair',
    name: 'Laser Hair Removal',
    sessions: 6,
    duration: 30,
    spacingWeeks: { min: 4, max: 6, default: 5 },
    spacingLabel: 'Recommended 4–6 weeks apart',
    totalPrice: 1080,
    perSessionPrice: 180,
    savings: 120,
    consultRequired: true,
  },
  {
    id: 'microneedling-3',
    serviceId: 'microneedling',
    name: 'Microneedling',
    sessions: 3,
    duration: 60,
    spacingWeeks: { min: 4, max: 6, default: 5 },
    spacingLabel: 'Recommended 4–6 weeks apart',
    totalPrice: 1050,
    perSessionPrice: 350,
    savings: 150,
    consultRequired: true,
  },
  {
    id: 'chemical-peel-3',
    serviceId: 'chemical-peel',
    name: 'Chemical Peel',
    sessions: 3,
    duration: 45,
    spacingWeeks: { min: 3, max: 4, default: 4 },
    spacingLabel: 'Recommended 3–4 weeks apart',
    totalPrice: 675,
    perSessionPrice: 225,
    savings: 75,
    consultRequired: true,
  },
  {
    id: 'hydrafacial-6',
    serviceId: 'hydrafacial',
    name: 'HydraFacial',
    sessions: 6,
    duration: 60,
    spacingWeeks: { min: 4, max: 4, default: 4 },
    spacingLabel: 'Recommended 4 weeks apart',
    totalPrice: 1020,
    perSessionPrice: 170,
    savings: 180,
    consultRequired: false,
  },
  {
    id: 'iv-therapy-4',
    serviceId: 'iv-therapy',
    name: 'IV Therapy',
    sessions: 4,
    duration: 45,
    spacingWeeks: { min: 2, max: 3, default: 3 },
    spacingLabel: 'Recommended 2–3 weeks apart',
    totalPrice: 600,
    perSessionPrice: 150,
    savings: 100,
    consultRequired: false,
  },
];

export function findSeriesById(id) {
  return SERIES_PACKAGES.find((p) => p.id === id);
}

export const PRACTITIONERS = [
  {
    id: 'chen',
    name: 'Dr. Sarah Chen',
    credentials: 'MD',
    initials: 'SC',
    accent: 'blush',
    specialties: ['Botox', 'Filler', 'Sculptra', 'Laser', 'PRP', 'CoolSculpting', 'Microneedling'],
    bio: "12 years in medical aesthetics. Sarah's approach is precise and conservative — she'd rather under-treat at first and refine than overdo it.",
    services: ['botox', 'filler', 'sculptra', 'laser-hair', 'prp', 'coolsculpting', 'microneedling'],
  },
  {
    id: 'martinez',
    name: 'Jessica Martinez',
    credentials: 'RN, BSN',
    initials: 'JM',
    accent: 'gold',
    specialties: ['Botox', 'Filler', 'Sculptra', 'PRP', 'Microneedling'],
    bio: "Natural-looking injectables. Most of Jessica's clients want friends to compliment them, not notice the Botox.",
    services: ['botox', 'filler', 'sculptra', 'prp', 'microneedling'],
  },
  {
    id: 'reyes',
    name: 'Amanda Reyes',
    credentials: 'LE',
    initials: 'AR',
    accent: 'cream',
    specialties: ['HydraFacial', 'Diamond Glow', 'Microneedling', 'Chemical Peel', 'Laser'],
    bio: "Personalized skin-care plans. Amanda builds routines around real lives — not 12-step regimens nobody follows.",
    services: ['hydrafacial', 'diamond-glow', 'microneedling', 'chemical-peel', 'laser-hair'],
  },
  {
    id: 'park',
    name: 'Dr. Michael Park',
    credentials: 'MD',
    initials: 'MP',
    accent: 'espresso',
    specialties: ['IV Therapy', 'B12', 'CoolSculpting', 'PRP'],
    bio: "Wellness and aesthetic medicine. Michael blends preventive care with aesthetics — most clients come for one and stay for both.",
    services: ['iv-therapy', 'b12', 'coolsculpting', 'prp'],
  },
  {
    id: 'brooks',
    name: 'Taylor Brooks',
    credentials: 'RN',
    initials: 'TB',
    accent: 'blush',
    specialties: ['Botox', 'Filler', 'IV Therapy', 'B12'],
    bio: "Aesthetics and wellness. Taylor specializes in subtle enhancements paired with IV protocols for sustained results.",
    services: ['botox', 'filler', 'iv-therapy', 'b12'],
  },
];

export function findPractitionerById(id) {
  return PRACTITIONERS.find((p) => p.id === id);
}

export function practitionersForService(serviceId) {
  return PRACTITIONERS.filter((p) => p.services.includes(serviceId));
}

export const HEAR_ABOUT_OPTIONS = ['Google', 'Instagram', 'Friend/Family', 'Yelp', 'Other'];

export const PLACEHOLDERS = {
  spaName: 'Lumera Aesthetics',
  spaPhone: '(813) 555-0142',
  spaAddress: '2401 W Kennedy Blvd, Suite 200, Tampa, FL 33609',
};

export const FEES = {
  consultation: 75,
  sameDayDeposit: 150,
};
