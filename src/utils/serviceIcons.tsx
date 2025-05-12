import React from 'react';
import { Camera, Video, Film, Compass, Plane, LayoutPanelTop, Box as Box3d, Instagram, Globe, Link, Sunset, Sofa } from 'lucide-react';

type IconComponent = React.FC<{ className?: string }>;

export const getServiceIcon = (serviceId: string): IconComponent => {
  switch (serviceId) {
    case 'hdrPhotography':
      return Camera;
    case 'cinematicVideo':
      return Film;
    case 'virtualTour':
      return Compass;
    case 'droneAerialPhotos':
      return Plane;
    case 'droneAerialVideoPhotos':
      return Video;
    case 'floorPlan':
      return LayoutPanelTop;
    case 'floorPlan2d3d':
      return Box3d;
    case 'twilightPhotography':
      return Sunset;
    case 'socialMediaReel':
      return Instagram;
    case 'virtualStaging':
      return Sofa;
    case 'propertyWebsite':
      return Globe;
    case 'customDomainName':
      return Link;
    default:
      return Camera;
  }
};