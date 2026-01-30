import nodemailer from 'nodemailer';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    orderNumber: string;
    email: string;
    phone: string;
    totalAmount: number;
    items: OrderItem[];
    deliveryDetails: {
        fullName: string;
        address: string;
        city: string;
        postalCode: string;
    };
}

type OrderStatus = 'received' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

const statusMessages: Record<OrderStatus, { subject: string; heading: string; message: string; emoji: string; color: string }> = {
    received: {
        subject: 'Order Received - Burger House',
        heading: 'Order Confirmed! 🎉',
        message: 'We have received your order and it will be processed shortly.',
        emoji: '📋',
        color: '#3b82f6',
    },
    preparing: {
        subject: 'Your Order is Being Prepared - Burger House',
        heading: 'Cooking in Progress! 👨‍🍳',
        message: 'Our chefs are preparing your delicious meal with care.',
        emoji: '🍳',
        color: '#f59e0b',
    },
    out_for_delivery: {
        subject: 'Your Order is On the Way - Burger House',
        heading: 'Out for Delivery! 🚀',
        message: 'Your order is on its way to you. Get ready to enjoy!',
        emoji: '🛵',
        color: '#8b5cf6',
    },
    delivered: {
        subject: 'Order Delivered - Burger House',
        heading: 'Order Delivered! ✅',
        message: 'Your order has been delivered. Enjoy your meal!',
        emoji: '✅',
        color: '#22c55e',
    },
    cancelled: {
        subject: 'Order Cancelled - Burger House',
        heading: 'Order Cancelled',
        message: 'Your order has been cancelled. If you have any questions, please contact us.',
        emoji: '❌',
        color: '#ef4444',
    },
};

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

// Generate HTML email template
const generateEmailHTML = (order: Order, status: OrderStatus): string => {
    const statusInfo = statusMessages[status];
    const itemsHTML = order.items
        .map(
            (item) => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">LKR ${(item.price * item.quantity).toLocaleString()}</td>
            </tr>
        `
        )
        .join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${statusInfo.subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🍔 Burger House</h1>
                            </td>
                        </tr>
                        
                        <!-- Status Banner -->
                        <tr>
                            <td style="background-color: ${statusInfo.color}; padding: 30px; text-align: center;">
                                <div style="font-size: 48px; margin-bottom: 10px;">${statusInfo.emoji}</div>
                                <h2 style="margin: 0; color: #ffffff; font-size: 24px;">${statusInfo.heading}</h2>
                                <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">${statusInfo.message}</p>
                            </td>
                        </tr>
                        
                        <!-- Order Details -->
                        <tr>
                            <td style="padding: 40px;">
                                <!-- Order Number -->
                                <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                                    <p style="margin: 0 0 5px; color: #6b7280; font-size: 14px;">Order Number</p>
                                    <p style="margin: 0; color: #111827; font-size: 20px; font-weight: bold;">${order.orderNumber}</p>
                                </div>
                                
                                <!-- Items Table -->
                                <h3 style="margin: 0 0 15px; color: #111827; font-size: 18px;">Order Items</h3>
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                                    <thead>
                                        <tr style="background-color: #f9fafb;">
                                            <th style="padding: 12px; text-align: left; color: #6b7280; font-weight: 600;">Item</th>
                                            <th style="padding: 12px; text-align: center; color: #6b7280; font-weight: 600;">Qty</th>
                                            <th style="padding: 12px; text-align: right; color: #6b7280; font-weight: 600;">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${itemsHTML}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colspan="2" style="padding: 15px 12px; font-weight: bold; color: #111827; font-size: 18px;">Total</td>
                                            <td style="padding: 15px 12px; text-align: right; font-weight: bold; color: #f97316; font-size: 20px;">LKR ${order.totalAmount.toLocaleString()}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                                
                                <!-- Delivery Details -->
                                <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px;">
                                    <h3 style="margin: 0 0 15px; color: #111827; font-size: 18px;">📍 Delivery Details</h3>
                                    <p style="margin: 0 0 5px; color: #374151;"><strong>${order.deliveryDetails.fullName}</strong></p>
                                    <p style="margin: 0 0 5px; color: #6b7280;">${order.deliveryDetails.address}</p>
                                    <p style="margin: 0 0 5px; color: #6b7280;">${order.deliveryDetails.city}, ${order.deliveryDetails.postalCode}</p>
                                    <p style="margin: 10px 0 0; color: #374151;">📞 ${order.phone}</p>
                                </div>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #18181b; padding: 30px; text-align: center;">
                                <p style="margin: 0 0 10px; color: #a1a1aa; font-size: 14px;">Thank you for ordering from Burger House!</p>
                                <p style="margin: 0; color: #71717a; font-size: 12px;">© 2024 Burger House. All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

// Send order status email
export async function sendOrderStatusEmail(order: Order, status: OrderStatus): Promise<boolean> {
    try {
        // Check if SMTP is configured
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn('SMTP credentials not configured. Skipping email notification.');
            return false;
        }

        const transporter = createTransporter();
        const statusInfo = statusMessages[status];
        const html = generateEmailHTML(order, status);

        await transporter.sendMail({
            from: `"Burger House" <${process.env.SMTP_USER}>`,
            to: order.email,
            subject: statusInfo.subject,
            html,
        });

        console.log(`Order status email sent to ${order.email} for order ${order.orderNumber}`);
        return true;
    } catch (error) {
        console.error('Failed to send order status email:', error);
        return false;
    }
}
