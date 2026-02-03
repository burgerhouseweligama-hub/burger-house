import User from '@/models/User';

const ADMIN_EMAIL = 'burgerhouseweligama@gmail.com';
const ADMIN_PASSWORD = 'Lahiru@1234';
const ADMIN_NAME = 'Burger House Admin';

// Global promise to prevent race conditions
let seedingPromise: Promise<void> | null = null;

export async function seedAdmin(): Promise<void> {
    if (seedingPromise) return seedingPromise;

    seedingPromise = (async () => {
        try {
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
        } catch (error) {
            console.error('Error seeding admin:', error);
            seedingPromise = null;
        }
    })();

    return seedingPromise;
}
