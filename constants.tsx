
import { BookingStatus, SlotType, WeddingBooking, ViewingRequest, MenuPackage, AvailabilitySlot, AddonService } from './types';

export const INITIAL_BOOKINGS: WeddingBooking[] = [
  {
    id: 'W-101',
    clientName: 'Sarah & James',
    contact: 'sarah.j@example.com',
    phoneNumber: '+60 12-345 6789',
    date: '2024-06-15',
    slot: SlotType.NIGHT,
    status: BookingStatus.APPROVED,
    guests: 1000,
    totalAmount: 19900,
    menuPackageId: 'M1',
    notes: 'Requires extra space for photo booth'
  },
  {
    id: 'W-102',
    clientName: 'Michael & Lin',
    contact: 'lin.m@example.com',
    phoneNumber: '+60 17-987 6543',
    date: '2024-06-20',
    slot: SlotType.DAY,
    status: BookingStatus.PENDING,
    guests: 100,
    totalAmount: 790,
    menuPackageId: 'M2'
  }
];

export const INITIAL_VIEWINGS: ViewingRequest[] = [
  {
    id: 'V-201',
    clientName: 'Emma Watson',
    contact: 'emma@watson.co',
    date: '2024-05-10',
    time: '14:00',
    status: BookingStatus.PENDING
  }
];

export const INITIAL_MENUS: MenuPackage[] = [
  {
    id: 'M1',
    name: 'Pakej Sanding Excellence',
    basePax: 1000,
    basePrice: 19900,
    pricePerPax: 19.9,
    description: 'Premier all-in package for large celebrations with Set A/B options.',
    items: ['Nasi Beriani/Jagung/Hujan Panas', 'Ayam Masak Merah/Sambal', 'Daging Beriani/Bistik/Asam Pedas', 'Sayur Dalca', 'Jelatah/Pajeri Nenas', 'Air Balang (14 Jenis)'],
    brideItems: ['Ayam Golek Istimewa', 'Udang Panjat', 'Siakap Tiga Rasa', 'Buah-buahan Ukiran', 'Puding Diraja'],
    inclusions: ['50 Pax Hidangan Pengantin', 'Hidangan Sampingan (Kuih)', 'Percuma DJ & PA Sistem', 'Kek 2 Tingkat', 'Full Hall Deco'],
    icon: 'fa-crown'
  },
  {
    id: 'M2',
    name: 'Pakej Nikah Sarapan',
    basePax: 100,
    basePrice: 790,
    pricePerPax: 7.9,
    description: 'Morning tea and breakfast package for intimate Nikah ceremonies.',
    items: ['Mee Goreng', 'Bihun Goreng', 'Nasi Lemak', 'Aneka Kuih-muih', 'Air Panas & Sejuk'],
    brideItems: ['Set Sarapan Premium', 'Buah-buahan Segar'],
    inclusions: ['Meja Nikah', 'Set Kerusi Dior'],
    icon: 'fa-sun'
  }
];

export const INITIAL_ADDONS_PORTFOLIO: AddonService[] = [
  {
    id: 'A1',
    name: 'Official Event Photographer',
    category: 'Photographer',
    price: 1500,
    description: '8 hours coverage, unlimited high-res softcopies, 1 custom album.',
    icon: 'fa-camera'
  },
  {
    id: 'A2',
    name: 'Digital E-Card Suite',
    category: 'E-Card',
    price: 150,
    description: 'Animated digital invite with RSVP system and location maps.',
    icon: 'fa-envelope-open-text'
  },
  {
    id: 'A3',
    name: 'Professional Emcee & Sound System',
    category: 'MC',
    price: 800,
    description: 'Bilingual host for the ceremony with basic PA setup, experienced in wedding protocols.',
    icon: 'fa-microphone-lines'
  },
  {
    id: 'A4',
    name: 'Premium Hall Audio System',
    category: 'Sound System',
    price: 1200,
    description: 'Line array speaker system, 4 wireless mics, and dedicated sound engineer.',
    icon: 'fa-tower-broadcast'
  }
];

export const INITIAL_STALLS: string[] = ['Ayam Golek', 'Kuali Goreng', 'Apam Crispy', 'Aiskrim'];

export const INITIAL_AVAILABILITY: AvailabilitySlot[] = [
  { date: '2024-06-15', daySlot: true, nightSlot: false },
  { date: '2024-06-16', daySlot: true, nightSlot: true },
];
