import { Scheme, SchemeType } from './types';

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Delhi"
];

export const MOCK_SCHEMES: Scheme[] = [
  {
    id: '1',
    title: 'Pradhan Mantri Awas Yojana (Urban)',
    type: SchemeType.CENTRAL,
    description: 'A flagship mission implementing by the Ministry of Housing and Urban Affairs (MoHUA) which ensures a pucca house to all eligible urban households.',
    benefits: [
      'Subsidy on home loan interest',
      'Financial assistance for house construction',
      'Affordable rental housing complexes'
    ],
    eligibility: [
      'Annual family income up to ₹18 Lakhs',
      'Must not own a pucca house anywhere in India',
      'Urban resident'
    ],
    applicationProcess: [
      'Visit the official PMAY(U) website.',
      'Select "Citizen Assessment" option.',
      'Fill in your Aadhaar details.',
      'Complete the application form and submit.'
    ],
    tags: ['Housing', 'Urban', 'Subsidy'],
    minAge: 18,
    maxAge: 70
  },
  {
    id: '2',
    title: 'Startup India Seed Fund Scheme',
    type: SchemeType.CENTRAL,
    description: 'Financial assistance to startups for proof of concept, prototype development, product trials, market entry and commercialization.',
    benefits: [
      'Up to ₹20 Lakhs as grant for validation',
      'Up to ₹50 Lakhs as investment for scaling',
      'Mentorship from incubators'
    ],
    eligibility: [
      'Startup recognized by DPIIT',
      'Incorporated not more than 2 years ago',
      'Business idea to use technology'
    ],
    applicationProcess: [
      'Register on Startup India portal.',
      'Login and access the Seed Fund Scheme dashboard.',
      'Apply to preferred incubators.',
      'Submit the pitch deck and required documents.'
    ],
    tags: ['Business', 'Youth', 'Funding'],
    minAge: 18
  },
  {
    id: '3',
    title: 'Ladli Behna Yojana',
    type: SchemeType.STATE,
    state: 'Madhya Pradesh',
    description: 'A scheme to make women financially independent, improve their health and nutritional status and increase their role in family decisions.',
    benefits: [
      '₹1250 credited monthly to bank account',
      'Social security and empowerment',
      'Direct Benefit Transfer (DBT)'
    ],
    eligibility: [
      'Resident of Madhya Pradesh',
      'Married women aged 21-60 years',
      'Annual family income less than ₹2.5 Lakhs'
    ],
    applicationProcess: [
      'Visit the nearest Gram Panchayat or Ward office.',
      'Carry Aadhaar card and Samagra ID.',
      'Fill the application form offline (camps are organized).',
      'Link bank account with Aadhaar.'
    ],
    tags: ['Women', 'Welfare', 'Financial Aid'],
    minAge: 21,
    maxAge: 60
  },
  {
    id: '4',
    title: 'Gruha Lakshmi Scheme',
    type: SchemeType.STATE,
    state: 'Karnataka',
    description: 'Provides financial assistance to the woman head of the household to support family maintenance.',
    benefits: [
      '₹2,000 monthly assistance',
      'Direct transfer to bank account'
    ],
    eligibility: [
      'Woman head of family in Ration Card',
      'Resident of Karnataka',
      'Family should not be paying GST or Income Tax'
    ],
    applicationProcess: [
      'Register via Seva Sindhu portal.',
      'Or visit Karnataka One / Bangalore One centers.',
      'Provide Ration card number and Aadhaar linked mobile number.'
    ],
    tags: ['Women', 'Karnataka', 'Welfare'],
    minAge: 18
  },
  {
    id: '5',
    title: 'PM Kisan Samman Nidhi',
    type: SchemeType.CENTRAL,
    description: 'Central sector scheme with 100% funding from Government of India. Income support of ₹6,000 per year is provided to all land holding farmer families.',
    benefits: [
      '₹6,000 per year in three installments',
      'Direct bank transfer',
      'Financial support for agriculture inputs'
    ],
    eligibility: [
      'Small and marginal farmers',
      'Must hold cultivate land',
      'Excludes institutional land holders'
    ],
    applicationProcess: [
      'Visit PM Kisan portal.',
      'Go to "New Farmer Registration".',
      'Enter Aadhaar and Land details.',
      'Submit for approval by state nodal officer.'
    ],
    tags: ['Agriculture', 'Farmers', 'Income'],
    minAge: 18
  },
    {
    id: '6',
    title: 'Yuva Nidhi Scheme',
    type: SchemeType.STATE,
    state: 'Karnataka',
    description: 'Unemployment allowance for graduates and diploma holders who passed out in the academic year 2022-23.',
    benefits: [
      '₹3,000 per month for degree holders',
      '₹1,500 per month for diploma holders',
      'Assistance for up to 2 years'
    ],
    eligibility: [
      'Passed degree/diploma in 2022-23',
      'Domicile of Karnataka',
      'Unemployed for 6 months after passing'
    ],
    applicationProcess: [
      'Apply through Seva Sindhu portal.',
      'Upload marks card and domicile certificate.',
      'Self-declare unemployment status.'
    ],
    tags: ['Youth', 'Education', 'Unemployment'],
    minAge: 21,
    maxAge: 35
  }
];