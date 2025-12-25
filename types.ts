
export enum BookingStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

export enum SlotType {
  DAY = 'DAY',
  NIGHT = 'NIGHT'
}

export interface WeddingBooking {
  id: string;
  clientName: string;
  contact: string; // Email
  phoneNumber: string; // Phone number
  date: string;
  slot: SlotType;
  status: BookingStatus;
  guests: number;
  totalAmount: number;
  menuPackageId?: string; 
  isCustomMenu?: boolean;
  customMenuItems?: string[];
  customBrideItems?: string[]; // New: Items for the bride/groom main table
  addons?: string[]; 
  notes?: string;
}

export interface ViewingRequest {
  id: string;
  clientName: string;
  contact: string;
  date: string;
  time: string;
  status: BookingStatus;
}

export interface MenuPackage {
  id: string;
  name: string;
  basePax: number;
  basePrice: number;
  pricePerPax: number; 
  description: string;
  items: string[];
  brideItems?: string[]; // New: Specific items for the bride/groom main table
  inclusions?: string[];
  icon: string; 
}

export interface AddonService {
  id: string;
  name: string;
  category: 'Photographer' | 'E-Card' | 'Attire' | 'MC' | 'Sound System' | 'Other';
  price: number;
  description: string;
  icon: string;
}

export interface AvailabilitySlot {
  date: string;
  daySlot: boolean; 
  nightSlot: boolean; 
}

export interface AppState {
  bookings: WeddingBooking[];
  viewings: ViewingRequest[];
  menus: MenuPackage[];
  addonsPortfolio: AddonService[];
  availability: AvailabilitySlot[];
  isCateringEnabled: boolean;
  cateringOnlyMode: boolean; // Toggle for "Catering Service Without Hall"
  stallItems: string[];
}
