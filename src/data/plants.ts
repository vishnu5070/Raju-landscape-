export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  type: 'Decorative' | 'Flowering' | 'Indoor' | 'Medicinal' | 'Outdoor';
  color: string;
  description: string;
  sunlight: string;
  water: string;
  care: 'Easy' | 'Medium' | 'Hard';
  image: string;
  priceEstimate: string; // Adds premium feel for catalog
  benefits: string[];
}

export const PLANTS: Plant[] = [
  {
    id: "rose-pink",
    name: "Classic Pink Rose",
    scientificName: "Rosa 'Floribunda'",
    type: "Flowering",
    color: "Pink",
    description: "An elegant, continuous blooming blush rose plant that boasts clusters of sweet-scented floral structures. Adds a sophisticated touch to outdoor paths and cottage gardens.",
    sunlight: "Full Sun (6+ hours)",
    water: "Moderate (Deep watering once a week)",
    care: "Medium",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    priceEstimate: "Rs. 250 - 350",
    benefits: ["Attracts helpful pollinators", "Excellent sweet fragrance", "Long-lasting seasonal blooms"]
  },
  {
    id: "snake-plant",
    name: "Variegated Snake Plant",
    scientificName: "Sansevieria trifasciata",
    type: "Indoor",
    color: "Deep Green & Gold",
    description: "Highly structural upright foliage with decorative golden margins. Renowned as a low-light indoor air purifier that can withstand days of neglect with grace.",
    sunlight: "Low to Bright Indirect Light",
    water: "Low (Water only when soil is bone dry)",
    care: "Easy",
    image: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=800&auto=format&fit=crop&q=80",
    priceEstimate: "Rs. 180 - 290",
    benefits: ["Superb oxygen production at night", "Filters room toxins", "Extremely drought tolerant"]
  },
  {
    id: "monstera-del",
    name: "Swiss Cheese Monstera",
    scientificName: "Monstera deliciosa",
    type: "Indoor",
    color: "Vibrant Dark Green",
    description: "prized for its large, iconic split leaves. Adds a magnificent, bold tropical statement to modern apartments, workspaces, and ambient rooms.",
    sunlight: "Medium to Bright Indirect Light",
    water: "Moderate (Allow top 2 inches of soil to dry)",
    care: "Easy",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&auto=format&fit=crop&q=80",
    priceEstimate: "Rs. 450 - 600",
    benefits: ["High aesthetic charm", "Humidifies ambient air", "Fast growing summer climber"]
  },
  {
    id: "aloe-vera",
    name: "Therapeutic Aloe Vera",
    scientificName: "Aloe barbadensis miller",
    type: "Medicinal",
    color: "Pale Green",
    description: "Stemless succulent featuring structural plump spikes filled with a cool bioactive gel. Widely farmed for its organic skin-hydration and natural burn-soothing solutions.",
    sunlight: "Direct Sunlight or Bright Sunwells",
    water: "Low (Sparing root-watering)",
    care: "Easy",
    image: "https://images.unsplash.com/photo-1596547610196-0afbe1284566?w=800&auto=format&fit=crop&q=80",
    priceEstimate: "Rs. 120 - 190",
    benefits: ["Natural skin-soothing gel", "Tells when it needs water", "Thrives in sunny kitchen windows"]
  },
  {
    id: "holy-basil-tulsi",
    name: "Holy Basil (Tulsi)",
    scientificName: "Ocimum tenuiflorum",
    type: "Medicinal",
    color: "Earthy Green & Purple Leaves",
    description: "A highly sacred aromatic subshrub widely kept in Indian households. Treasured for botanical teas, stress-relieving properties, and its beautifully spicy-sweet scent.",
    sunlight: "Full Sun (Prefers morning warm sun)",
    water: "Moderate (Daily light watering)",
    care: "Easy",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80",
    priceEstimate: "Rs. 80 - 150",
    benefits: ["Adaptogen stress reliever", "Inbuilt mosquito deterrent", "Immunity boosting leaves"]
  },
  {
    id: "lavender-perfume",
    name: "Aromatic French Lavender",
    scientificName: "Lavandula angustifolia",
    type: "Flowering",
    color: "Deep Violet Purple",
    description: "Sensory delight boasting silvery-grey dense foliage culminating in fragrant blue-violet blossoms. Perfect for sunny gravel borders, warm patios, and dry pathways.",
    sunlight: "Full Unobstructed Sun",
    water: "Low (Requires gravel-dry spacing)",
    care: "Medium",
    image: "https://images.unsplash.com/photo-1528826722302-d3743a9d5923?w=800&auto=format&fit=crop&q=80",
    priceEstimate: "Rs. 300 - 450",
    benefits: ["Natural pest repellent", "Fabulous culinary aroma", "Attracts bright honeybees"]
  },
  {
    id: "areca-palm",
    name: "Graceful Areca Palm",
    scientificName: "Dypsis lutescens",
    type: "Decorative",
    color: "Golden Soft Green",
    description: "Feathery, arching golden-green stems that mimic butterfly wings. Creates an excellent acoustic and visual privacy screen for patio fences and bright cozy corners.",
    sunlight: "Bright Filtered Sunlight",
    water: "Moderate (Enjoys humid misty soil)",
    care: "Medium",
    image: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&auto=format&fit=crop&q=80",
    priceEstimate: "Rs. 350 - 550",
    benefits: ["Active transpirational humidifier", "Aesthetic divider panels", "Pet-safe and non-toxic foliage"]
  },
  {
    id: "bougainvillea-mag",
    name: "Paper Bloom Bougainvillea",
    scientificName: "Bougainvillea spectabilis",
    type: "Outdoor",
    color: "Electric Magenta",
    description: "A magnificent ornamental vine that carpets fences and archways in paper-like purple-pink blossoms. Possesses thorns and absolute resilience to high heat and strong wind.",
    sunlight: "Full Direct Sun",
    water: "Low (Hardy and drought tolerant)",
    care: "Easy",
    image: "https://images.unsplash.com/photo-1505322437651-7667adcfdc39?w=800&auto=format&fit=crop&q=80",
    priceEstimate: "Rs. 200 - 320",
    benefits: ["Spectacular visual trellis coverage", "Practically free from garden pests", "Blooms multiple times a year"]
  },
  {
    id: "juniper-bonsai",
    name: "Aged Juniper Bonsai",
    scientificName: "Juniperus procumbens 'Nana'",
    type: "Decorative",
    color: "Dark Forest Green",
    description: "An authentic Japanese-style evergreen tree trained beautifully to evoke scale and age. Instantly captures serenity and focal appreciation in workspace displays.",
    sunlight: "Bright Bright Indirect Light",
    water: "Moderate (Needs consistent mist and dampness)",
    care: "Hard",
    image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800&auto=format&fit=crop&q=80",
    priceEstimate: "Rs. 1,200 - 2,500",
    benefits: ["Elegant Zen art piece", "Improves mental calm and focus", "A rewarding multigenerational companion"]
  },
  {
    id: "garden-mint",
    name: "Refreshing Garden Mint",
    scientificName: "Mentha spicata",
    type: "Medicinal",
    color: "Bright Leaf Green",
    description: "A wildly fragrant, easy-to-grow herb essential for culinary recipes, refreshing herbal teas, and creating aromatic borders that naturally fend off standard garden bugs.",
    sunlight: "Partial Shaded Spots / Full Sun",
    water: "High (Prefers consistently damp roots)",
    care: "Easy",
    image: "https://images.unsplash.com/photo-1608797178974-15b35a61d121?w=800&auto=format&fit=crop&q=80",
    priceEstimate: "Rs. 70 - 120",
    benefits: ["Invaluable kitchen spice helper", "Incredibly fast root spreading", "Soothing cooling scent"]
  },
  {
    id: "scarlet-bromeliad",
    name: "Scarlet Guzmania Bromeliad",
    scientificName: "Guzmania lingulata",
    type: "Flowering",
    color: "Electric Scarlet Orange",
    description: "An exotic epiphyte forming glossy evergreen leaf cups from which a glowing scarlet star flower erupts. Stays brilliantly colored indoors for over twelve solid weeks.",
    sunlight: "Bright Indirect Filtered Light",
    water: "Moderate (Fill native leaf cup center)",
    care: "Medium",
    image: "https://images.unsplash.com/photo-1517482813589-98516d2cc143?w=800&auto=format&fit=crop&q=80",
    priceEstimate: "Rs. 400 - 550",
    benefits: ["Dramatic, tropical focus points", "Adapts securely to home temps", "Extended bloom longevity"]
  },
  {
    id: "peace-lily",
    name: "Serene Peace Lily",
    scientificName: "Spathiphyllum wallisii",
    type: "Indoor",
    color: "Forest Green & Snow White",
    description: "A striking interior plant displaying magnificent, pure-white spoon-shaped bracts. Let you know when it is thirsty by its structural droop, bouncing back shortly in pride.",
    sunlight: "Medium to Low Filtered Light",
    water: "Moderate (Weekly thorough saturating)",
    care: "Easy",
    image: "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=800&auto=format&fit=crop&q=80",
    priceEstimate: "Rs. 220 - 340",
    benefits: ["Supreme foliage air filtration", "Signals room humidity balance", "Thrives beautifully with minimal sun"]
  }
];
