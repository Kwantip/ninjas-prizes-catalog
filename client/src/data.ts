// Belt Map: key-value pair of belt color-multplier
export const beltMap = new Map<string, number>([
    ['White', 1],
    ['Yellow', 2],
    ['Orange', 2],
    ['Green', 3],
    ['Blue', 3],
    ['Purple', 4],
    ['Brown', 4],
    ['Red', 5],
    ['Black', 5]
]);

// Prizes Page

export const COIN = {
    Silver: 'Silver',
    Gold: 'Gold',
    Obsidian: 'Obsidian'
} as const;

// Price
export interface Price {
    coinType: string;
    quantity: number
}

// PrizeCategory
export interface PrizeCategory {
    id: number;
    name: string;
    price_quantity: number;
    price_coin_type: string;
    image: string;
    description: string;
}

// PrizeItem
export interface PrizeItem {
    id: number;
    prize_category_id: number;
    name: string;
    description: string;
    URL: string;
    image: string;
    isInStock: boolean;
}

// PrizeCategory list
export const prizeCategoryList: PrizeCategory[] = [
      {
        id: 0,
        name: "Sanrio Keychains",
        price_quantity: 3,
        price_coin_type: COIN.Gold,
        image: "SanrioKeychains-2.jpg",
        description: "Keychains of Sanrio characters!!"
      },
      {
        id: 1,
        name: "DIY Minecraft Keychains",
        price_quantity: 3,
        price_coin_type: COIN.Gold,
        image: "DIYMinecraftKeychains-0.jpg",
        description: "Minecraft keychains that you can build."
      },
      {
        id: 2,
        name: "Fidget Toy",
        price_quantity: 1,
        price_coin_type: COIN.Gold,
        image: "FidgetToy-0.png",
        description: "A very cool fidget toy!"
      },
      {
        id: 3,
        name: "Pins",
        price_quantity: 2,
        price_coin_type: COIN.Gold,
        image: "Pins-0.jpg",
        description: "Small pin badges"
      },
      {
        id: 4,
        name: "Evie",
        price_quantity: 1,
        price_coin_type: COIN.Gold,
        image: "Evie-0.jpg",
        description: "BEVIEVIE"
      }
    ]

// PrizeItem list
export const prizeItemList: PrizeItem[] = [
    {
        id: 0,
        prize_category_id: 0,
        name: "Kuromi",
        description: "",
        URL: "",
        image: "",
        isInStock: true
    },
    {
        id: 1,
        prize_category_id: 0,
        name: "Hello Kitty",
        description: "",
        URL: "",
        image: "SanrioKeychains-2.jpg",
        isInStock: true
    },
    {
        id: 2,
        prize_category_id: 0,
        name: "Cinnamonroll",
        description: "",
        URL: "",
        image: "",
        isInStock: true
    },
    {
        id: 3,
        prize_category_id: 0,
        name: "My Melody",
        description: "",
        URL: "",
        image: "",
        isInStock: true
    },
    {
        id: 4,
        name: "Pig",
        prize_category_id: 1,
        description: "",
        URL: "",
        image: "DIYMinecraftKeychains-0.jpg",
        isInStock: true
    },
    {
        id: 5,
        name: "Creeper",
        prize_category_id: 1,
        description: "",
        URL: "",
        image: "",
        isInStock: true
    },
    {
        id: 6,
        name: "Enderman",
        prize_category_id: 1,
        description: "",
        URL: "",
        image: "",
        isInStock: true
    },
    {
        id: 7,
        name: "Fidget Toy",
        prize_category_id: 2,
        description: "A very cool fidget toy!",
        URL: "",
        image: "FidgetToy-0.png",
        isInStock: true
    },
    {
        id: 8,
        name: "Pins",
        prize_category_id: 3,
        description: "Small pin badges",
        URL: "",
        image: "Pins-0.jpg",
        isInStock: true
    },
    {
        id: 9,
        name: "Evie",
        prize_category_id: 4,
        description: "BEVIEVIE",
        URL: "",
        image: "Evie-0.jpg",
        isInStock: true
    }
]


// Premium PrizeCategory list

export const premiumPrizeCategoryList: PrizeCategory[] = [
    {
        id: 5,
        name: "Katana",
        price_quantity: 3,
        price_coin_type: COIN.Obsidian,
        image: "Katana-1.jpg",
        description: "Expandable katana."
    },
    {
        id: 6,
        name: "Dragon",
        price_quantity: 6,
        price_coin_type: COIN.Obsidian,
        image: "Dragon-0.jpg",
        description: "Very cool dragon!"
    },
    {
        id: 7,
        name: "Mini Katana",
        price_quantity: 1,
        price_coin_type: COIN.Obsidian,
        image: "MiniKatana-0.png",
        description: "A smaller version of the Katana"
    }
]

// Premium PrizeItem list

export const premiumPrizeItemList: PrizeItem[] = [
    {
        id: 10,
        name: "Red",
        prize_category_id: 5,
        description: "Red",
        URL: "",
        image: "Katana-1.jpg",
        isInStock: true
    },
    {
        id: 11,
        name: "Blue",
        prize_category_id: 5,
        description: "Blue",
        URL: "",
        image: "Katana-2.png",
        isInStock: true
    },
    {
        id: 12,
        name: "Dragon",
        prize_category_id: 6,
        description: "Very cool dragon!",
        URL: "",
        image: "Dragon-0.jpg",
        isInStock: true
    },
    {
        id: 13,
        name: "Mini Katana",
        prize_category_id: 7,
        description: "A smaller version of the Katana",
        URL: "",
        image: "MiniKatana-0.png",
        isInStock: true
    }
]

// Order Status
export const STATUS = {
    Pending: 'PENDING',
    PaymentRequired: 'PAYMENT REQUIRED',
    InQueue: 'IN QUEUE',
    Processing: 'PROCESSING',
    Completed: 'COMPLETED',
    Delivered: 'DELIVERED',
    Denied: 'DENIED'
} as const;