import { Service } from '../types';

export interface Bundle {
  id: string;
  name: string;
  services: string[];
  bonusDiscount: number;
  description: string;
}

export const bundles: Bundle[] = [
  {
    id: 'virtualBoost',
    name: 'Virtual Boost Bundle',
    services: ['hdrPhotography', 'virtualTour'],
    bonusDiscount: 2,
    description: 'Popular for out-of-town buyers'
  },
  {
    id: 'skyLimit',
    name: "The Sky's the Limit",
    services: ['hdrPhotography', 'droneAerialPhotos', 'droneAerialVideoPhotos'],
    bonusDiscount: 3,
    description: 'Highlights property from above'
  },
  {
    id: 'socialSeller',
    name: 'Social Seller',
    services: ['cinematicVideo', 'socialMediaReel'],
    bonusDiscount: 3,
    description: 'Perfect for Instagram & TikTok'
  },
  {
    id: 'floorPlanFlow',
    name: 'Floor Plan Flow',
    services: ['floorPlan', 'floorPlan2d3d', 'hdrPhotography'],
    bonusDiscount: 2,
    description: 'For clear layout representation'
  },
  {
    id: 'listingMagnet',
    name: 'Listing Magnet',
    services: ['hdrPhotography', 'virtualTour', 'propertyWebsite'],
    bonusDiscount: 3,
    description: 'SEO + virtual = online magnet'
  },
  {
    id: 'contentKing',
    name: 'Content King',
    services: ['hdrPhotography', 'cinematicVideo', 'socialMediaReel'],
    bonusDiscount: 4,
    description: 'Full content suite for social'
  },
  {
    id: 'turnkeyTour',
    name: 'Turnkey Tour',
    services: ['virtualTour', 'floorPlan', 'virtualStaging'],
    bonusDiscount: 3,
    description: 'Makes listings show-ready'
  },
  {
    id: 'visualWow',
    name: 'Visual Wow Factor',
    services: ['virtualStaging', 'droneAerialPhotos', 'cinematicVideo'],
    bonusDiscount: 2,
    description: 'Eye-catching and impactful'
  },
  {
    id: 'fullSuitePro',
    name: 'Full Suite Pro',
    services: ['hdrPhotography', 'droneAerialPhotos', 'cinematicVideo', 'virtualTour', 'socialMediaReel', 'propertyWebsite', 'floorPlan', 'floorPlan2d3d'],
    bonusDiscount: 6,
    description: 'High-roller option, close to Ultimate'
  }
];

export const findApplicableBundles = (selectedServiceIds: string[]): Bundle[] => {
  return bundles.filter(bundle => 
    bundle.services.every(serviceId => 
      selectedServiceIds.includes(serviceId)
    )
  );
};

export const calculateBundleDiscount = (bundles: Bundle[]): number => {
  if (bundles.length === 0) return 0;
  return Math.max(...bundles.map(bundle => bundle.bonusDiscount));
};