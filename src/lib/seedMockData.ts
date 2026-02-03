import connectDB from './db';
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

const MOCK_PRODUCTS = [
    {
        name: 'Classic Burger',
        description: 'Juicy beef patty with fresh lettuce, tomato, and our secret sauce.',
        price: 8.99,
        categoryName: 'Burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
        isAvailable: true,
    },
    {
        name: 'Cheese Burger',
        description: 'Classic burger with melted cheddar cheese.',
        price: 9.99,
        categoryName: 'Burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
        isAvailable: true,
    },
    {
        name: 'Crispy Fries',
        description: 'Golden crispy fries seasoned with sea salt.',
        price: 3.99,
        categoryName: 'Sides',
        image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&q=80',
        isAvailable: true,
    },
    {
        name: 'Coke',
        description: 'Chilled Coca-Cola.',
        price: 1.99,
        categoryName: 'Drinks',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80',
        isAvailable: true,
    },
    {
        name: 'Chocolate Lava Cake',
        description: 'Rich chocolate cake with a molten center.',
        price: 5.99,
        categoryName: 'Desserts',
        image: 'https://images.unsplash.com/photo-1563729768601-d6d84f8546b9?w=800&q=80',
        isAvailable: true,
    },
];

let isMockDataSeeded = false;

export async function seedMockData(): Promise<void> {
    if (isMockDataSeeded) return;

    try {
        await connectDB();

        // Check if categories exist
        const categoryCount = await Category.countDocuments();
        if (categoryCount === 0) {
            console.log('Seeding mock categories...');
            const createdCategories = [];

            for (const catDetails of MOCK_CATEGORIES) {
                const category = await Category.create(catDetails);
                createdCategories.push(category);
            }
            console.log(`✅ Seeded ${createdCategories.length} categories`);

            // Seed products only if categories were just created (fresh database)
            // or we could check for products independently, but linking requires categories
            console.log('Seeding mock products...');

            for (const prodDetails of MOCK_PRODUCTS) {
                const category = await Category.findOne({ name: prodDetails.categoryName });
                if (category) {
                    await Product.create({
                        ...prodDetails,
                        category: category._id,
                    });
                }
            }
            console.log('✅ Seeded mock products');
        } else {
            // Optional: Check if products exist even if categories do, but simpler to rely on clean state or partial checks
            const productCount = await Product.countDocuments();
            if (productCount === 0) {
                console.log('Categories exist but products do not. Seeding mock products...');
                for (const prodDetails of MOCK_PRODUCTS) {
                    const category = await Category.findOne({ name: prodDetails.categoryName });
                    if (category) {
                        await Product.create({
                            ...prodDetails,
                            category: category._id,
                        });
                    }
                }
                console.log('✅ Seeded mock products');
            }
        }

        isMockDataSeeded = true;
    } catch (error) {
        console.error('Error seeding mock data:', error);
    }
}
