export interface Store {
    id?: string;
    email: string;
    name: string;
    lat: number;
    lng: number;
    images?: string[];
    address?: string;
    url?: string;
    phone: string;
}

export interface UserProfile {
    id?: string;
    email: string;
    name: string;
    notification: boolean;
}

export interface Review {
    id?: string;
    userName?: string;
    storeId?: string;
    text: string;
    stars: number;
    image?: string;
    timestamp?: number;
}

export interface ChatRoom {
    id?: string;
    names: string[]; // store name, user name
    users: {
        [key: string]: boolean; // participants of the room; just 2 users
    };
}

export interface ChatMessage {
    id?: string;
    sender: string; // email
    text: string;
    timestamp: number;
}
