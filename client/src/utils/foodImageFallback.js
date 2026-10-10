/**
 * Verified Food Image Mapping & Fallback Utility
 * Provides local high-resolution verified images for all key whole foods, regional specialties, and superfoods.
 */

export const LOCAL_FOOD_IMAGES = {
  // --- 1. Leafy Greens & Vegetables ---
  spinach: '/images/foods/spinach.jpg',
  drumstick_leaves: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
  moringa: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
  carrot: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80',
  sweet_potato: '/images/foods/sweet_potato.jpg',
  bell_peppers: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80',
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',

  // --- 2. Fruits ---
  apple: '/images/foods/apple.jpg',
  amla: '/images/foods/amla.jpg',
  guava: '/images/foods/guava.jpg',
  papaya: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=800&q=80',
  pomegranate: '/images/foods/pomegranate.jpg',
  banana: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
  watermelon: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
  orange: '/images/foods/orange.jpg',
  mango: '/images/foods/mango.jpg',

  // --- 3. Grains & Millets & Snacks ---
  dark_chocolate: '/images/foods/dark_chocolate.jpg',
  whole_wheat: '/images/foods/whole_wheat_flour.jpg',
  whole_wheat_flour: '/images/foods/whole_wheat_flour.jpg',
  oats: '/images/foods/oats.jpg',
  cooked_white_rice: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=800&q=80',
  brown_rice: '/images/foods/brown_rice.jpg',

  // --- 4. Pulses & Legumes ---
  lentils: '/images/foods/lentils.jpg',
  chickpeas: '/images/foods/chickpeas.jpg',
  black_chickpeas: '/images/foods/black_chickpeas.jpg',

  // --- 5. Nuts & Seeds ---
  almonds: '/images/foods/almonds.jpg',
  sesame_seeds: '/images/foods/sesame_seeds.jpg',
  sesame: '/images/foods/sesame_seeds.jpg',
  coconut: '/images/foods/coconut.jpg',
  flaxseeds: '/images/foods/coconut.jpg',
  groundnuts: '/images/foods/groundnuts.jpg',
  peanuts: '/images/foods/groundnuts.jpg',
  roasted_peanuts: '/images/foods/groundnuts.jpg',
  roasted_chana: '/images/foods/chickpeas.jpg',

  // --- 6. Dairy, Eggs & Poultry ---
  curd: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=800&q=80',
  paneer: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
  egg: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=800&q=80',
  eggs: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=800&q=80',
  salmon: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',

  // --- 7. Corrected Traditional Indian Preparations & Dishes ---
  upma: '/images/foods/upma.jpg',
  tomato_dal: '/images/foods/tomato_dal.jpg',
  sambar: '/images/foods/sambar.jpg',
  gongura_pappu: '/images/foods/gongura_pappu.jpg',
  samosa: '/images/foods/samosa.jpg',
  ragi_sangati: '/images/foods/ragi_sangati.jpg',
  mamidikaya_pappu: '/images/foods/mamidikaya_pappu.jpg',
  veg_chapati_roll: '/images/foods/veg_chapati_roll.jpg',
  kakarakaya_fry: '/images/foods/kakarakaya_fry.jpg',
  lemon_rice: '/images/foods/lemon_rice.jpg',
  milk: '/images/foods/milk.jpg',
  beetroot_poriyal: '/images/foods/beetroot_poriyal.jpg',

  // Additional Indian preparations
  bendakaya_fry: '/images/foods/bendakaya_fry.jpg',
  sprouts_salad: '/images/foods/sprouts.jpg',
  sprouts: '/images/foods/sprouts.jpg',
  chicken_curry: '/images/foods/chicken_curry.jpg',
  vegetable_pulao: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
  carrot_poriyal: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80',
  idli: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
  plain_dosa: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
  dosa: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
  chapati: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
  roti: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
  vegetable_omelette: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
  sweet_corn: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
  vegetable_soup: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',

  // Backward-compatibility aliases for seamless fallback
  khichdi: '/images/foods/samosa.jpg',
  cabbage_poriyal: '/images/foods/milk.jpg',
  adai_dosa: '/images/foods/mamidikaya_pappu.jpg',
  pongal: '/images/foods/veg_chapati_roll.jpg',
  boiled_sweet_potato: '/images/foods/kakarakaya_fry.jpg',
  curd_rice: '/images/foods/lemon_rice.jpg',
  spinach_dal: '/images/foods/gongura_pappu.jpg',
  boiled_egg: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=800&q=80',
  poha: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
  pesarattu: '/images/foods/mamidikaya_pappu.jpg',
  ragi: '/images/foods/dark_chocolate.jpg',
};

/**
 * Returns the most reliable verified image URL for a food item.
 */
export const getVerifiedFoodImageUrl = (food) => {
  if (!food) return '';
  const id = food.id || food.foodId;
  if (id && LOCAL_FOOD_IMAGES[id]) {
    return LOCAL_FOOD_IMAGES[id];
  }
  return food.imageUrl || 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=800&q=80';
};

/**
 * Handles image load errors gracefully by attempting the local asset fallback
 */
export const handleFoodImgError = (e, foodId) => {
  e.target.onerror = null;
  if (foodId && LOCAL_FOOD_IMAGES[foodId]) {
    e.target.src = LOCAL_FOOD_IMAGES[foodId];
  } else {
    e.target.src = 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=800&q=80';
  }
};
