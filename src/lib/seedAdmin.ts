import connectDB from './db';
import User from '@/models/User';

const ADMIN_EMAIL = 'burgerhouseweligama@gmail.com';
const ADMIN_PASSWORD = 'Lahiru@1234';
const ADMIN_NAME = 'Burger House Admin';

let isSeeded = false;

export async function seedAdmin(): Promise<void> {
    // Only seed once per server instance
    if (isSeeded) return;

    try {
        await connectDB();

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

        if (!existingAdmin) {
            await User.create({
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                name: ADMIN_NAME,
                role: 'admin',
            });
            console.log('✅ Admin user seeded successfully');
        }

        isSeeded = true;
    } catch (error) {
        console.error('Error seeding admin:', error);
    }
}
