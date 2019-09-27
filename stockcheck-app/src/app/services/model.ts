export class Inventory {
    id: string;
    code?: string;
    imageUrl?: any;
    name: string;
    price: number;
    quantity: number;
    notification?: boolean;

    constructor() {
        this.quantity = 0;
    }
}

export interface UserProfile {
    isAdmin?: boolean;
    email: string;
    token?: string;
}
