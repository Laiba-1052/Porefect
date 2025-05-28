// Dummy data for the application when Firestore is not connected

export const dummyUser = {
  uid: 'demo-user-321',
  username: 'Hashir',
  email: 'sarah@example.com',
  skinType: 'combination',
  createdAt: new Date(2023, 5, 15).toISOString()
};

export const dummyRoutines = [
  {
    id: 'routine-1',
    name: 'Morning Routine',
    timeOfDay: 'morning',
    userId: dummyUser.uid,
    createdAt: new Date(2023, 5, 20).toISOString(),
    lastPerformed: new Date(2023, 8, 15).toISOString(),
    steps: [
      {
        id: 'step-1',
        order: 1,
        name: 'Cleanser',
        productId: 'product-1',
        notes: 'Use lukewarm water and gentle circular motions.'
      },
      {
        id: 'step-2',
        order: 2,
        name: 'Toner',
        productId: 'product-2',
        notes: 'Apply with cotton pad.'
      },
      {
        id: 'step-3',
        order: 3,
        name: 'Vitamin C Serum',
        productId: 'product-3',
        notes: 'Use 3-4 drops for entire face.'
      },
      {
        id: 'step-4',
        order: 4,
        name: 'Moisturizer',
        productId: 'product-4',
        notes: ''
      },
      {
        id: 'step-5',
        order: 5,
        name: 'Sunscreen',
        productId: 'product-5',
        notes: 'Apply generously and reapply every 2 hours if outside.'
      }
    ]
  },
  {
    id: 'routine-2',
    name: 'Evening Routine',
    timeOfDay: 'evening',
    userId: dummyUser.uid,
    createdAt: new Date(2023, 5, 20).toISOString(),
    lastPerformed: new Date(2023, 8, 14).toISOString(),
    steps: [
      {
        id: 'step-6',
        order: 1,
        name: 'Oil Cleanser',
        productId: 'product-6',
        notes: 'Massage onto dry skin, then rinse.'
      },
      {
        id: 'step-7',
        order: 2,
        name: 'Water-Based Cleanser',
        productId: 'product-1',
        notes: 'Second cleanse to remove any remaining residue.'
      },
      {
        id: 'step-8',
        order: 3,
        name: 'Exfoliant (2x weekly)',
        productId: 'product-7',
        notes: 'Use only twice a week.'
      },
      {
        id: 'step-9',
        order: 4,
        name: 'Toner',
        productId: 'product-2',
        notes: ''
      },
      {
        id: 'step-10',
        order: 5,
        name: 'Retinol Serum',
        productId: 'product-8',
        notes: 'Use every other night.'
      },
      {
        id: 'step-11',
        order: 6,
        name: 'Night Cream',
        productId: 'product-9',
        notes: 'Apply a thick layer.'
      }
    ]
  },
  {
    id: 'routine-3',
    name: 'Weekly Mask',
    timeOfDay: 'custom',
    userId: dummyUser.uid,
    createdAt: new Date(2023, 6, 10).toISOString(),
    lastPerformed: new Date(2023, 8, 10).toISOString(),
    steps: [
      {
        id: 'step-12',
        order: 1,
        name: 'Clay Mask',
        productId: 'product-10',
        notes: 'Apply to clean, damp skin. Avoid eye area. Leave for 10 minutes.'
      },
      {
        id: 'step-13',
        order: 2,
        name: 'Rose Water Spray',
        productId: 'product-11',
        notes: 'Spritz generously after rinsing mask.'
      },
      {
        id: 'step-14',
        order: 3,
        name: 'Hydrating Serum',
        productId: 'product-12',
        notes: 'Apply while skin is still damp from rose water.'
      }
    ]
  }
];

export const dummyProducts = [
  {
    id: 'product-1',
    name: 'CeraVe Hydrating Cleanser',
    brand: 'CeraVe',
    category: 'Cleanser',
    userId: dummyUser.uid,
    purchaseDate: new Date(2023, 4, 5).toISOString(),
    expiryDate: new Date(2024, 4, 5).toISOString(),
    openedDate: new Date(2023, 5, 1).toISOString(),
    periodAfterOpening: 12, // months
    price: 12.99,
    size: '16 oz',
    ingredients: 'Aqua, Glycerin, Cetearyl Alcohol, Phenoxyethanol, Stearyl Alcohol, Cetyl Alcohol...',
    notes: 'Gentle, non-foaming cleanser that works well for morning and second cleanse at night.',
    rating: 4,
    imageUrl: 'https://images.pexels.com/photos/3820380/pexels-photo-3820380.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'product-2',
    name: 'Thayers Witch Hazel Toner',
    brand: 'Thayers',
    category: 'Toner',
    userId: dummyUser.uid,
    purchaseDate: new Date(2023, 5, 10).toISOString(),
    expiryDate: new Date(2025, 5, 10).toISOString(),
    openedDate: new Date(2023, 5, 15).toISOString(),
    periodAfterOpening: 12, // months
    price: 9.99,
    size: '12 oz',
    ingredients: 'Purified Water, Aloe Barbadensis Leaf Juice, Glycerin, Phenoxyethanol...',
    notes: 'Alcohol-free and gentle. Leaves skin feeling fresh but not tight.',
    rating: 5,
    imageUrl: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  // Additional products truncated for brevity
  {
    id: 'product-3',
    name: 'Timeless Vitamin C Serum',
    brand: 'Timeless',
    category: 'Serum',
    userId: dummyUser.uid,
    rating: 4,
    imageUrl: 'https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'product-4',
    name: 'Neutrogena Hydro Boost',
    brand: 'Neutrogena',
    category: 'Moisturizer',
    userId: dummyUser.uid,
    rating: 4,
    imageUrl: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'product-5',
    name: 'Biore UV Aqua Rich Sunscreen',
    brand: 'Biore',
    category: 'Sunscreen',
    userId: dummyUser.uid,
    rating: 5,
    imageUrl: 'https://images.pexels.com/photos/3621234/pexels-photo-3621234.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'product-6',
    name: 'DHC Deep Cleansing Oil',
    brand: 'DHC',
    category: 'Cleanser',
    userId: dummyUser.uid,
    rating: 5,
    imageUrl: 'https://images.pexels.com/photos/4202326/pexels-photo-4202326.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
];

export const dummyTasks = [
  {
    id: 'task-1',
    title: 'Morning Routine',
    type: 'routine',
    routineId: 'routine-1',
    userId: dummyUser.uid,
    schedule: 'daily',
    time: '07:00',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // All days
    completed: false,
    lastCompleted: new Date(2023, 8, 15).toISOString(),
    createdAt: new Date(2023, 5, 15).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Evening Routine',
    type: 'routine',
    routineId: 'routine-2',
    userId: dummyUser.uid,
    schedule: 'daily',
    time: '21:00',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // All days
    completed: false,
    lastCompleted: new Date(2023, 8, 14).toISOString(),
    createdAt: new Date(2023, 5, 15).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Clay Mask',
    type: 'routine',
    routineId: 'routine-3',
    userId: dummyUser.uid,
    schedule: 'weekly',
    time: '19:00',
    daysOfWeek: [0], // Sunday
    completed: false,
    lastCompleted: new Date(2023, 8, 10).toISOString(),
    createdAt: new Date(2023, 6, 10).toISOString(),
  },
  {
    id: 'task-4',
    title: 'Replace Pillowcase',
    type: 'task',
    userId: dummyUser.uid,
    schedule: 'weekly',
    time: '',
    daysOfWeek: [0, 3], // Sunday and Wednesday
    completed: true,
    lastCompleted: new Date(2023, 8, 13).toISOString(),
    createdAt: new Date(2023, 7, 1).toISOString(),
  },
  {
    id: 'task-5',
    title: 'Clean Makeup Brushes',
    type: 'task',
    userId: dummyUser.uid,
    schedule: 'weekly',
    time: '',
    daysOfWeek: [6], // Saturday
    completed: false,
    lastCompleted: new Date(2023, 8, 9).toISOString(),
    createdAt: new Date(2023, 7, 1).toISOString(),
  }
];

export const dummyReviews = [
  {
    id: 'review-1',
    productId: 'product-1',
    userId: dummyUser.uid,
    username: dummyUser.username,
    rating: 4,
    title: 'Great gentle cleanser',
    comment: 'This cleanser is very gentle and doesn\'t strip my skin. I use it both morning and night, and my skin feels clean but not tight afterward. Highly recommend for sensitive skin types!',
    createdAt: new Date(2023, 6, 15).toISOString(),
    helpfulCount: 5
  },
  {
    id: 'review-2',
    productId: 'product-2',
    userId: dummyUser.uid,
    username: dummyUser.username,
    rating: 5,
    title: 'Holy grail toner',
    comment: 'This has become a staple in my routine. The witch hazel helps control oil without being drying, and I love that it\'s alcohol-free. My skin looks clearer and more balanced since I started using it.',
    createdAt: new Date(2023, 6, 20).toISOString(),
    helpfulCount: 7
  },
  {
    id: 'review-3',
    productId: 'product-5',
    userId: dummyUser.uid,
    username: dummyUser.username,
    rating: 5,
    title: 'Best Sunscreen Ever',
    comment: 'I\'ve tried so many sunscreens that left a white cast or felt greasy, but this one is perfect! It\'s lightweight, absorbs quickly, and works under makeup. Plus, no white cast on my medium skin tone.',
    createdAt: new Date(2023, 7, 5).toISOString(),
    helpfulCount: 12
  }
];

export const dummyIngredients = [
  {
    name: 'Hyaluronic Acid',
    description: 'A powerful humectant that can hold up to 1000x its weight in water. Helps hydrate the skin and reduce the appearance of fine lines.',
    concerns: 'Generally considered safe for all skin types',
    benefits: 'Hydration, plumping, moisture retention',
    products: ['CeraVe Hydrating Cleanser', 'Neutrogena Hydro Boost', 'The Ordinary Hyaluronic Acid 2% + B5']
  },
  {
    name: 'Niacinamide',
    description: 'Also known as Vitamin B3, it\'s a water-soluble vitamin that works with the natural substances in your skin.',
    concerns: 'Generally safe, but some people may experience flushing',
    benefits: 'Minimizes pores, regulates oil production, improves skin texture, brightens skin tone',
    products: ['The Ordinary Niacinamide 10% + Zinc 1%', 'Paula\'s Choice 10% Niacinamide Booster']
  },
  {
    name: 'Retinol',
    description: 'A derivative of Vitamin A that promotes skin renewal and enhances collagen production.',
    concerns: 'Can cause irritation, dryness, and increased sun sensitivity. Not recommended for pregnant women.',
    benefits: 'Reduces fine lines and wrinkles, improves skin texture, treats acne, evens skin tone',
    products: ['The Ordinary Retinol 0.5% in Squalane', 'CeraVe Skin Renewing Retinol Serum']
  },
  {
    name: 'Glycolic Acid',
    description: 'An alpha-hydroxy acid (AHA) derived from sugar cane that exfoliates the skin.',
    concerns: 'Can cause sun sensitivity. May be too harsh for sensitive skin.',
    benefits: 'Exfoliates dead skin cells, improves skin texture, brightens complexion',
    products: ['The Ordinary Glycolic Acid 7% Toning Solution', 'Pixi Glow Tonic']
  },
  {
    name: 'Salicylic Acid',
    description: 'A beta-hydroxy acid (BHA) that penetrates oil-filled pores to exfoliate from within.',
    concerns: 'May be drying if overused. Not recommended during pregnancy.',
    benefits: 'Treats and prevents acne, exfoliates, reduces inflammation',
    products: ['Paula\'s Choice 2% BHA Liquid Exfoliant', 'The Ordinary Salicylic Acid 2% Solution']
  }
];

export const dummyActivities = [
  {
    id: 'activity-1',
    type: 'routine_completed',
    routineId: 'routine-1',
    routineName: 'Morning Routine',
    userId: dummyUser.uid,
    timestamp: new Date(2023, 8, 15, 7, 30).toISOString()
  },
  {
    id: 'activity-2',
    type: 'routine_completed',
    routineId: 'routine-2',
    routineName: 'Evening Routine',
    userId: dummyUser.uid,
    timestamp: new Date(2023, 8, 14, 22, 15).toISOString()
  },
  {
    id: 'activity-3',
    type: 'product_added',
    productId: 'product-12',
    productName: 'The Ordinary Niacinamide Serum',
    userId: dummyUser.uid,
    timestamp: new Date(2023, 8, 14, 15, 0).toISOString()
  },
  {
    id: 'activity-4',
    type: 'review_added',
    reviewId: 'review-3',
    productName: 'Biore UV Aqua Rich Sunscreen',
    userId: dummyUser.uid,
    timestamp: new Date(2023, 8, 12, 16, 45).toISOString()
  },
  {
    id: 'activity-5',
    type: 'routine_completed',
    routineId: 'routine-3',
    routineName: 'Weekly Mask',
    userId: dummyUser.uid,
    timestamp: new Date(2023, 8, 10, 19, 30).toISOString()
  }
];

export const dummySuggestions = {
  'dry': [
    {
      name: 'Hydrating Morning Routine',
      description: 'A gentle morning routine focused on hydration for dry skin types.',
      steps: [
        { name: 'Gentle Hydrating Cleanser', description: 'Use a non-foaming cleanser that won\'t strip your skin of natural oils.' },
        { name: 'Hydrating Toner', description: 'Apply a toner with hyaluronic acid to add hydration.' },
        { name: 'Moisturizing Serum', description: 'Use a serum with hyaluronic acid or glycerin.' },
        { name: 'Rich Moisturizer', description: 'Apply a rich, cream-based moisturizer.' },
        { name: 'Sunscreen', description: 'Finish with a hydrating sunscreen (SPF 30 or higher).' }
      ]
    },
    {
      name: 'Overnight Moisture Replenishment',
      description: 'An evening routine designed to replenish moisture overnight.',
      steps: [
        { name: 'Oil Cleanser', description: 'Remove makeup and sunscreen with an oil cleanser.' },
        { name: 'Gentle Hydrating Cleanser', description: 'Follow with a gentle, hydrating second cleanse.' },
        { name: 'Hydrating Toner/Essence', description: 'Apply a hydrating toner or essence.' },
        { name: 'Serum with Ceramides', description: 'Use a serum with ceramides to strengthen your skin barrier.' },
        { name: 'Facial Oil', description: 'Apply a few drops of nourishing facial oil.' },
        { name: 'Rich Night Cream', description: 'Seal everything in with a rich night cream.' },
        { name: 'Occlusive (Optional)', description: 'In very dry conditions, finish with an occlusive like Aquaphor or Vaseline.' }
      ]
    }
  ],
  'oily': [
    {
      name: 'Oil-Balancing Morning Routine',
      description: 'A morning routine focused on balancing oil production without over-drying.',
      steps: [
        { name: 'Gentle Foaming Cleanser', description: 'Use a gentle foaming cleanser to remove excess oil.' },
        { name: 'Balancing Toner', description: 'Apply an alcohol-free toner with witch hazel or BHA.' },
        { name: 'Lightweight Hydrating Serum', description: 'Use a lightweight serum with niacinamide to control oil.' },
        { name: 'Oil-Free Moisturizer', description: 'Apply a lightweight, oil-free gel moisturizer.' },
        { name: 'Mattifying Sunscreen', description: 'Finish with a mattifying sunscreen (SPF 30 or higher).' }
      ]
    },
    {
      name: 'Evening Clarifying Routine',
      description: 'An evening routine designed to clarify and prevent breakouts without stripping the skin.',
      steps: [
        { name: 'Oil Cleanser', description: 'Remove makeup and sunscreen with an oil cleanser (oil dissolves oil).' },
        { name: 'Foaming Cleanser', description: 'Follow with a gentle foaming cleanser.' },
        { name: 'Exfoliating Toner', description: 'Use a BHA toner 2-3 times per week.' },
        { name: 'Hydrating Toner', description: 'On alternate days, use a hydrating, non-alcoholic toner.' },
        { name: 'Lightweight Serum', description: 'Apply a serum with niacinamide and zinc.' },
        { name: 'Lightweight Gel Moisturizer', description: 'Finish with a lightweight gel moisturizer.' }
      ]
    }
  ],
  'combination': [
    {
      name: 'Balanced Morning Routine',
      description: 'A morning routine that addresses both dry and oily areas.',
      steps: [
        { name: 'Gentle Cleanser', description: 'Use a gentle cleanser that won\'t strip dry areas or exacerbate oily ones.' },
        { name: 'Balancing Toner', description: 'Apply a balancing toner with gentle exfoliating properties.' },
        { name: 'Targeted Serum Application', description: 'Apply hydrating serum to dry areas and oil-control serum to T-zone.' },
        { name: 'Lightweight Moisturizer', description: 'Use a medium-weight moisturizer all over.' },
        { name: 'Sunscreen', description: 'Finish with a non-comedogenic sunscreen (SPF 30 or higher).' }
      ]
    },
    {
      name: 'Multi-Masking Evening Routine',
      description: 'An evening routine with targeted treatments for different facial zones.',
      steps: [
        { name: 'First Cleanse', description: 'Remove makeup and sunscreen with a cleansing balm or oil.' },
        { name: 'Second Cleanse', description: 'Follow with a gentle foaming or gel cleanser.' },
        { name: 'Exfoliation (2-3x weekly)', description: 'Use a gentle AHA/BHA exfoliant.' },
        { name: 'Multi-Masking (1-2x weekly)', description: 'Apply clay mask to oily areas and hydrating mask to dry areas.' },
        { name: 'Balancing Toner', description: 'Use a balancing, hydrating toner.' },
        { name: 'Serum', description: 'Apply niacinamide serum all over to balance oil production and hydrate.' },
        { name: 'Zone Treatment', description: 'Use lightweight gel moisturizer on oily areas and richer cream on dry areas.' }
      ]
    }
  ],
  'sensitive': [
    {
      name: 'Gentle Morning Protection',
      description: 'An ultra-gentle morning routine focused on protecting sensitive skin.',
      steps: [
        { name: 'Rinse with Water or Micellar Water', description: 'Skip cleanser in the morning or use micellar water if needed.' },
        { name: 'Soothing Toner', description: 'Apply an alcohol-free toner with calming ingredients.' },
        { name: 'Gentle Hydrating Serum', description: 'Use a simple serum with minimal ingredients and no fragrance.' },
        { name: 'Barrier-Supporting Moisturizer', description: 'Apply a moisturizer with ceramides and no potential irritants.' },
        { name: 'Mineral Sunscreen', description: 'Finish with a mineral-based sunscreen (zinc oxide/titanium dioxide).' }
      ]
    },
    {
      name: 'Restorative Evening Routine',
      description: 'A gentle evening routine focused on barrier repair and soothing.',
      steps: [
        { name: 'Gentle Oil Cleanser', description: 'Remove makeup and sunscreen with a fragrance-free oil cleanser.' },
        { name: 'Gentle Cream Cleanser', description: 'Follow with a super gentle cream or milk cleanser.' },
        { name: 'Calming Toner/Essence', description: 'Apply a toner with centella asiatica, aloe, or other soothing ingredients.' },
        { name: 'Barrier Repair Serum', description: 'Use a serum with panthenol, allantoin, or Centella asiatica.' },
        { name: 'Repairing Moisturizer', description: 'Apply a moisturizer with ceramides and fatty acids.' },
        { name: 'Occlusive (as needed)', description: 'In dry conditions or for very dry patches, finish with a thin layer of a healing ointment.' }
      ]
    }
  ],
  'acne-prone': [
    {
      name: 'Clarifying Morning Routine',
      description: 'A morning routine focused on preventing breakouts without over-drying.',
      steps: [
        { name: 'Gentle Cleanser with Salicylic Acid', description: 'Use a gentle cleanser with acne-fighting ingredients.' },
        { name: 'Alcohol-Free Toner', description: 'Apply an alcohol-free toner to restore pH balance.' },
        { name: 'Treatment Serum', description: 'Use a serum with niacinamide or azelaic acid.' },
        { name: 'Oil-Free Moisturizer', description: 'Apply a non-comedogenic, oil-free moisturizer.' },
        { name: 'Lightweight Sunscreen', description: 'Finish with a non-comedogenic sunscreen (SPF 30 or higher).' }
      ]
    },
    {
      name: 'Acne Treatment Evening Routine',
      description: 'An evening routine designed to treat and prevent acne while supporting skin healing.',
      steps: [
        { name: 'Oil-Based Cleanser', description: 'Remove makeup and sunscreen with a non-comedogenic oil cleanser.' },
        { name: 'Medicated Cleanser', description: 'Follow with a cleanser containing benzoyl peroxide or salicylic acid.' },
        { name: 'Hydrating Toner', description: 'Apply a hydrating, non-alcoholic toner.' },
        { name: 'Treatment', description: 'Use a retinoid, benzoyl peroxide, or salicylic acid product (not all at once).' },
        { name: 'Hydrating Serum', description: 'Apply a lightweight hydrating serum to prevent overdrying.' },
        { name: 'Oil-Free Moisturizer', description: 'Finish with a non-comedogenic moisturizer.' },
        { name: 'Spot Treatment (as needed)', description: 'Apply spot treatment only on active blemishes.' }
      ]
    }
  ]
};