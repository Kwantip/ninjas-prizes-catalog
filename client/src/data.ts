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
    price: Price;
    image: string;
    description: string;
}

// PrizeItem
export interface PrizeItem {
    id: number;
    prizeCategoryId: number;
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
        price: {
            quantity: 3,
            coinType: COIN.Gold
        },
        image: "SanrioKeychains-2.jpg",
        description: "Keychains of Sanrio characters!!"
      },
      {
        id: 1,
        name: "DIY Minecraft Keychains",
        price: {
            quantity: 3,
            coinType: COIN.Gold
        },
        image: "DIYMinecraftKeychains-0.jpg",
        description: "Minecraft keychains that you can build."
      },
      {
        id: 2,
        name: "Fidget Toy",
        price: {
            quantity: 1,
            coinType: COIN.Gold
        },
        image: "FidgetToy-0.png",
        description: "A very cool fidget toy!"
      },
      {
        id: 3,
        name: "Pins",
        price: {
            quantity: 2,
            coinType: COIN.Gold
        },
        image: "Pins-0.jpg",
        description: "Small pin badges"
      },
      {
        id: 4,
        name: "Evie",
        price: {
            quantity: 1,
            coinType: COIN.Gold
        },
        image: "Evie-0.jpg",
        description: "BEVIEVIE"
      }
    ]

// PrizeItem list
export const prizeItemList: PrizeItem[] = [
    {
        id: 0,
        prizeCategoryId: 0,
        name: "Kuromi",
        description: "",
        URL: "",
        image: "SanrioKeychains-1.jpg",
        isInStock: true
    },
    {
        id: 1,
        prizeCategoryId: 0,
        name: "Hello Kitty",
        description: "",
        URL: "",
        image: "SanrioKeychains-2.jpg",
        isInStock: true
    },
    {
        id: 2,
        prizeCategoryId: 0,
        name: "Cinnamonroll",
        description: "",
        URL: "",
        image: "",
        isInStock: true
    },
    {
        id: 3,
        prizeCategoryId: 0,
        name: "My Melody",
        description: "",
        URL: "",
        image: "",
        isInStock: true
    },
    {
        id: 4,
        name: "Pig",
        prizeCategoryId: 1,
        description: "",
        URL: "",
        image: "DIYMinecraftKeychains-0.jpg",
        isInStock: true
    },
    {
        id: 5,
        name: "Creeper",
        prizeCategoryId: 1,
        description: "",
        URL: "",
        image: "",
        isInStock: true
    },
    {
        id: 6,
        name: "Enderman",
        prizeCategoryId: 1,
        description: "",
        URL: "",
        image: "",
        isInStock: true
    },
    {
        id: 7,
        name: "Fidget Toy",
        prizeCategoryId: 2,
        description: "A very cool fidget toy!",
        URL: "",
        image: "FidgetToy-0.png",
        isInStock: true
    },
    {
        id: 8,
        name: "Pins",
        prizeCategoryId: 3,
        description: "Small pin badges",
        URL: "",
        image: "Pins-0.jpg",
        isInStock: true
    },
    {
        id: 9,
        name: "Evie",
        prizeCategoryId: 4,
        description: "BEVIEVIE",
        URL: "",
        image: "Evie-0.jpg",
        isInStock: true
    }
]