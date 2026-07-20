import { publicImages } from './images'

export const awards = [
  'Culinary Excellence Award – 2022',
  'Restaurant of the Year – 2023',
  'Best Fine Dining Experience – Foodie Magazine, 2023',
]

export const reviews = [
  {
    quote: 'Exceptional ambiance and unforgettable flavors.',
    source: 'Gourmet Review',
  },
  {
    quote: 'A must-visit restaurant for food enthusiasts.',
    source: 'The Daily Bite',
  },
]

export const galleryImages = [
  {
    id: 1,
    title: 'Main Dining Room',
    category: 'Interior',
    url: publicImages.cafeInterior,
    thumbUrl: publicImages.cafeInterior,
    alt: 'Warmly lit restaurant interior with elegant table settings',
  },
  {
    id: 2,
    title: 'Ribeye Steak',
    category: 'Dishes',
    url: publicImages.ribeyeSteak,
    thumbUrl: publicImages.ribeyeSteak,
    alt: 'Prime ribeye steak plated with garlic mashed potatoes',
  },
  {
    id: 5,
    title: 'Cheesecake',
    category: 'Desserts',
    url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&h=400&q=75',
    alt: 'Decadent cheesecake slice with a fine dining presentation',
    objectFit: 'contain',
  },
  {
    id: 3,
    title: 'Wine & Dine Evening',
    category: 'Events',
    url: publicImages.specialEvent,
    thumbUrl: publicImages.specialEvent,
    alt: 'Guests enjoying a special evening event at the restaurant',
  },
  {
    id: 7,
    title: 'Celebration Gathering',
    category: 'Events',
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&h=400&q=75',
    alt: 'An elegant table set for a special evening gathering',
  },
  {
    id: 4,
    title: 'Chef at the Pass',
    category: 'Behind the Scenes',
    url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=600&h=400&q=75',
    alt: 'Chef carefully plating a dish with refined precision',
  },
  {
    id: 6,
    title: 'Private Dining',
    category: 'Interior',
    url: publicImages.cafeInterior,
    thumbUrl: publicImages.cafeInterior,
    alt: 'Intimate private dining area with soft lighting',
  },
]

export const heroImage = {
  url: publicImages.homeHero,
  alt: 'Café Fausse — a modern Parisian dining experience',
}
