import Category from '@/models/Category';
import Product from '@/models/Product';

const MOCK_CATEGORIES = [
    {
        name: 'Burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    },
    {
        name: 'Sides',
        image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&q=80',
    },
    {
        name: 'Drinks',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80',
    },
    {
        name: 'Desserts',
        image: 'https://images.unsplash.com/photo-1563729768601-d6d84f8546b9?w=800&q=80',
    },
];

// Replaced broken URL (last one was 99c8a3bac7fe) with reliable ones
const BURGER_IMAGES = [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80',
    'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&q=80',
    'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&q=80', // New valid burger image
];

const SIDE_IMAGES = [
    'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&q=80',
    'https://images.unsplash.com/photo-1630384060421-a431e4cad2e7?w=800&q=80', // Onion rings
    'https://images.unsplash.com/photo-1605634685354-944203e06ea1?w=800&q=80', // Potato wedges
];

const DRINK_IMAGES = [
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80', // Cola
    'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80', // Orange Soda
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80', // Water
    'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80', // Shake
];

// Replaced broken URL (first one was d6d84f8546b9) with reliable ones
const DESSERT_IMAGES = [
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80', // Donut
    'https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?w=800&q=80', // Brownie
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', // Chocolate cake (valid)
];

// Helper to get random item from array
const random = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
// Helper to generate price in LKR (e.g., 450, 1200)
const randomPrice = (min: number, max: number) => Math.floor(Math.random() * ((max - min) / 50)) * 50 + min;

const ADJECTIVES = ['Spicy', 'Crispy', 'Double', 'Classic', 'Cheesy', 'Mega', 'Junior', 'Smoky', 'BBQ', 'Veggie', 'Supreme', 'Loaded', 'Golden', 'Chilled', 'Iced', 'Sweet', 'Royal', 'Ultimate'];

const BURGER_TYPES = ['Beef Burger', 'Chicken Burger', 'Fish Fillet', 'Veggie Delight', 'Cheeseburger', 'Bacon Buster', 'Mushroom Melt'];
const SIDE_TYPES = ['French Fries', 'Onion Rings', 'Potato Wedges', 'Mozzarella Sticks', 'Chicken Nuggets', 'Garlic Bread'];
const DRINK_TYPES = ['Cola', 'Lemonade', 'Iced Tea', 'Orange Juice', 'Milkshake', 'Mineral Water', 'Soda'];
const DESSERT_TYPES = ['Chocolate Cake', 'Vanilla Ice Cream', 'Brownie', 'Apple Pie', 'Donut', 'Cheesecake'];

function generateMockProducts(count: number) {
    const products = [];

    // Ensure we convert count to roughly equal distribution
    const perCategory = Math.ceil(count / 4);

    // Burgers
    for (let i = 0; i < perCategory; i++) {
        const type = random(BURGER_TYPES);
        const adj = random(ADJECTIVES);
        products.push({
            name: `${adj} ${type} ${i + 1}`,
            description: `A delicious ${adj.toLowerCase()} ${type.toLowerCase()} made with premium ingredients and our secret sauce.`,
            price: randomPrice(800, 2500),
            categoryName: 'Burgers',
            image: random(BURGER_IMAGES),
            isAvailable: Math.random() > 0.1, // 90% available
        });
    }

    // Sides
    for (let i = 0; i < perCategory; i++) {
        const type = random(SIDE_TYPES);
        const adj = random(ADJECTIVES);
        products.push({
            name: `${adj} ${type} ${i + 1}`,
            description: `Perfectly cooked ${type.toLowerCase()} with a ${adj.toLowerCase()} twist.`,
            price: randomPrice(400, 1200),
            categoryName: 'Sides',
            image: random(SIDE_IMAGES),
            isAvailable: Math.random() > 0.1,
        });
    }

    // Drinks
    for (let i = 0; i < perCategory; i++) {
        const type = random(DRINK_TYPES);
        const adj = random(ADJECTIVES);
        products.push({
            name: `${adj} ${type}`,
            description: `Refreshing ${type.toLowerCase()} to quench your thirst.`,
            price: randomPrice(200, 800),
            categoryName: 'Drinks',
            image: random(DRINK_IMAGES),
            isAvailable: Math.random() > 0.1,
        });
    }

    // Desserts
    for (let i = 0; i < perCategory; i++) {
        const type = random(DESSERT_TYPES);
        const adj = random(ADJECTIVES);
        products.push({
            name: `${adj} ${type}`,
            description: `Decadent ${type.toLowerCase()} for the perfect finish.`,
            price: randomPrice(500, 1500),
            categoryName: 'Desserts',
            image: random(DESSERT_IMAGES),
            isAvailable: Math.random() > 0.1,
        });
    }

    return products;
}

// Global promise to prevent race conditions during hot reloads or concurrent connections
let seedingPromise: Promise<void> | null = null;

export async function seedMockData(): Promise<void> {
    if (seedingPromise) return seedingPromise;

    seedingPromise = (async () => {
        try {
            // Check if categories exist
            const categoryCount = await Category.countDocuments();
            if (categoryCount === 0) {
                console.log('Seeding mock categories...');
                for (const catDetails of MOCK_CATEGORIES) {
                    await Category.create(catDetails);
                }
                console.log(`✅ Seeded ${MOCK_CATEGORIES.length} categories`);
            }

            // Check products. If we have less than 50, assume we need to seed/re-seed to reach our target of ~100
            const productCount = await Product.countDocuments();
            if (productCount < 50) {
                console.log(`Current product count (${productCount}) is low. Generating more mock products...`);

                const targetCount = 100 - productCount;
                const newProducts = generateMockProducts(targetCount);

                // Create a map of category names to IDs for faster lookup
                const categories = await Category.find();
                const categoryMap = new Map(categories.map(c => [c.name, c._id]));

                let seededCount = 0;
                for (const prodDetails of newProducts) {
                    const categoryId = categoryMap.get(prodDetails.categoryName);
                    if (categoryId) {
                        await Product.create({
                            ...prodDetails,
                            category: categoryId,
                        });
                        seededCount++;
                    }
                }
                console.log(`✅ Seeded ${seededCount} new mock products`);
            } else {
                console.log(`✅ Product count (${productCount}) is sufficient. Skipping seeding.`);
            }

        } catch (error) {
            console.error('Error seeding mock data:', error);
            // On error, reset the promise so we can retry later if needed
            seedingPromise = null;
        }
    })();

    return seedingPromise;
}
