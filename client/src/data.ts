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

export interface Ninja {
    id: number;
    first_name: string;
    last_name: string;
}

// Prizes Page

export const COIN = {
    Silver: 'Silver',
    Gold: 'Gold',
    Obsidian: 'Obsidian'
} as const;

// PrizeCategory
export interface PrizeCategory {
    id: number;
    name: string;
    price_quantity: number;
    price_coin_type: string;
    image: string;
    description: string;
    is_visible: boolean;
    is_orderable: boolean;
}

// PrizeItem
export interface PrizeItem {
    id: number;
    name: string;
    image: string;
    is_visible: boolean;
    prize_category_id: number;
}

// Color
export interface Color {
    id: number;
    name: string;
    is_available: boolean;
}

// Order Status
export const STATUS = {
    Pending: 'PENDING',
    PaymentRequired: 'PAYMENT REQUIRED',
    InQueue: 'IN QUEUE',
    Processing: 'PROCESSING',
    Completed: 'COMPLETED',
    Delivered: 'DELIVERED',
    Denied: 'DENIED',
    Cancelled: 'CANCELLED' //when a denied order is cancelled; filter out of the print queue
} as const;

// Order
export interface Order {
    id: number;
    first_name: string;
    last_name: string;
    print_name: string;
    link_to_item: string;
    color: string;
    notes: string;
    status: string;
    created_at: string;
    updated_at: string;
    status_changed_at: string;
}

export interface OrderRequest {
    first_name: string;
    last_name: string;
    print_name: string;
    link_to_item: string;
    color: string;
    notes: string;
}

// Order History
export interface OrderHistory {
    id: number;
    previous_status: string;
    new_status: string;
    changed_at: string;
    changed_by: string;
    order: Order;
}

export interface GameOfTheMonthEntry {
    name: string;
    added_at: string;
    link_to_game: string;
}

export interface LeaderboardEntry {
    id: number; //ninja id
    score: number;
}

export interface NinjaAction {
    id: number;
    name: string;
    price_quantity: number;
    price_coin_type: string;
    is_good: boolean;
    has_multiplier: boolean
}