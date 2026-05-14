export const BRAND = {
  name: 'Lumera',
  tagline: 'Aesthetics',
  legalName: 'Lumera Aesthetics',
  phone: '(813) 555-0142',
  phoneHref: 'tel:+18135550142',
  email: 'hello@lumera-aesthetics.com',
  address: {
    line1: '2401 W Kennedy Blvd',
    line2: 'Suite 200',
    city: 'Tampa',
    state: 'FL',
    zip: '33609',
  },
  hours: [
    { days: 'Monday – Friday', hours: '9:00 AM – 7:00 PM' },
    { days: 'Saturday',        hours: '9:00 AM – 5:00 PM' },
    { days: 'Sunday',          hours: 'Closed' },
  ],
  social: {
    instagram: 'https://instagram.com/',
    facebook:  'https://facebook.com/',
  },
  yearEstablished: 2014,
};

export const NAV_LINKS = [
  { label: 'Home',     href: '#',         current: false },
  { label: 'Services', href: '#',         current: false },
  { label: 'Team',     href: '#team',     current: false },
  { label: 'Book',     href: '#book',     current: true  },
  { label: 'Gallery',  href: '#',         current: false },
  { label: 'Contact',  href: '#contact',  current: false },
];

export const BOOKING_ANCHOR_ID = 'book';
