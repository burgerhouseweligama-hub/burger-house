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
    status: string;
    deliveryDetails: {
        fullName: string;
        address: string;
        city: string;
        postalCode: string;
    };
}

type OrderStatus =
    | 'order_received'
    | 'pending_confirmation'
    | 'preparing'
    | 'ready_for_pickup'
    | 'picked_up'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled';

const statusMessages: Record<OrderStatus, { subject: string; heading: string; message: string; emoji: string; color: string; badgeColor: string }> = {
    order_received: {
        subject: 'Order Received - Burger House',
        heading: 'Order Received 🎉',
        message: 'We have received your order and will start preparing it shortly.',
        emoji: '📋',
        color: '#3b82f6',
        badgeColor: '#dbeafe',
    },
    pending_confirmation: {
        subject: 'Order Pending Confirmation - Burger House',
        heading: 'Pending Confirmation ⏳',
        message: 'We are confirming your delivery details and will begin preparing soon.',
        emoji: '⏳',
        color: '#f59e0b',
        badgeColor: '#fef3c7',
    },
    preparing: {
        subject: 'Your Order is Being Prepared - Burger House',
        heading: 'Cooking in Progress 👨‍🍳',
        message: 'Our chefs are preparing your delicious meal with care.',
        emoji: '🍳',
        color: '#f97316',
        badgeColor: '#ffedd5',
    },
    ready_for_pickup: {
        subject: 'Your Order is Ready for Pickup - Burger House',
        heading: 'Ready for Pickup 🎉',
        message: 'Your order is ready. Please collect it at the store.',
        emoji: '📦',
        color: '#6366f1',
        badgeColor: '#e0e7ff',
    },
    picked_up: {
        subject: 'Order Picked Up - Burger House',
        heading: 'Order Picked Up ✅',
        message: 'Thank you for picking up your order. Enjoy your meal!',
        emoji: '✅',
        color: '#22c55e',
        badgeColor: '#dcfce7',
    },
    out_for_delivery: {
        subject: 'Your Order is On the Way - Burger House',
        heading: 'Out for Delivery 🚀',
        message: 'Your order is on its way to you. Get ready to enjoy!',
        emoji: '🛵',
        color: '#8b5cf6',
        badgeColor: '#ede9fe',
    },
    delivered: {
        subject: 'Order Delivered - Burger House',
        heading: 'Order Delivered ✅',
        message: 'Your order has been delivered. Enjoy your meal!',
        emoji: '✅',
        color: '#22c55e',
        badgeColor: '#dcfce7',
    },
    cancelled: {
        subject: 'Order Cancelled - Burger House',
        heading: 'Order Cancelled',
        message: 'Your order has been cancelled. If you have any questions, please contact us.',
        emoji: '❌',
        color: '#ef4444',
        badgeColor: '#fee2e2',
    },
};

// Generate HTML email template
const generateEmailHTML = (order: Order, status: OrderStatus): string => {
    const statusInfo = statusMessages[status];
    const itemsHTML = order.items
        .map(
            (item) => `
            <tr>
                <td style="padding: 16px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="display: block; font-weight: 600; color: #1f2937;">${item.name}</span>
                </td>
                <td style="padding: 16px 0; border-bottom: 1px solid #e5e7eb; text-align: center; color: #6b7280;">${item.quantity}</td>
                <td style="padding: 16px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #1f2937; font-weight: 500;">LKR ${(item.price * item.quantity).toLocaleString()}</td>
            </tr>
        `
        )
        .join('');

    const trackingLink = 'https://burger-house-weligama.netlify.app/profile';

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${statusInfo.subject}</title>
        <!--[if mso]>
        <noscript>
        <xml>
        <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        </noscript>
        <![endif]-->
        <style>
            body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; height: 100% !important; }
            body, table, td, div, p, a { -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse !important; border-spacing: 0; }
            img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
            #outlook a { padding: 0; }
            .ReadMsgBody { width: 100%; } .ExternalClass { width: 100%; }
            .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
            @media all and (min-width: 560px) {
                .container { border-radius: 16px !important; }
            }
        </style>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; color: #1f2937;">
        <div style="background-color: #f3f4f6; width: 100%; height: 100%;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td align="center" style="padding: 40px 20px;">
                        
                        <!-- Main Container -->
                        <table role="presentation" class="container" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; width: 100%; margin: 0 auto; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); overflow: hidden; border-radius: 0;">
                            
                            <!-- Header -->
                            <tr>
                                <td style="background-color: #000000; padding: 40px; text-align: center; background-image: radial-gradient(circle at center, #333333 0%, #000000 100%);">
                                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">🍔 Burger House</h1>
                                </td>
                            </tr>

                            <!-- Status Badge -->
                            <tr>
                                <td style="padding: 40px 40px 0 40px; text-align: center;">
                                    <div style="display: inline-block; padding: 12px 24px; background-color: ${statusInfo.badgeColor}; color: ${statusInfo.color}; border-radius: 50px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                                        ${order.status.replace(/_/g, ' ')}
                                    </div>
                                    <h2 style="margin: 20px 0 10px 0; color: #111827; font-size: 32px; font-weight: 800; line-height: 1.2;">${statusInfo.heading}</h2>
                                    <p style="margin: 0; color: #6b7280; font-size: 16px; line-height: 1.6;">${statusInfo.message}</p>
                                </td>
                            </tr>

                            <!-- CTA -->
                            <tr>
                                <td align="center" style="padding: 30px 40px;">
                                    <a href="${trackingLink}" style="display: inline-block; background-color: #f97316; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 32px; text-decoration: none; border-radius: 12px; transition: background-color 0.3s ease; box-shadow: 0 4px 6px rgba(249, 115, 22, 0.2);">
                                        View Order & Track
                                    </a>
                                </td>
                            </tr>

                            <!-- Order Card -->
                            <tr>
                                <td style="padding: 0 40px 40px 40px;">
                                    <div style="background-color: #f9fafb; border-radius: 16px; padding: 30px; border: 1px solid #e5e7eb;">
                                        
                                        <!-- Info Grid -->
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                                            <tr>
                                                <td width="50%" valign="top" style="padding-bottom: 20px;">
                                                    <p style="margin: 0 0 4px; color: #9ca3af; font-size: 12px; text-transform: uppercase; font-weight: 600;">Order Number</p>
                                                    <p style="margin: 0; color: #1f2937; font-weight: 700; font-size: 16px;">${order.orderNumber}</p>
                                                </td>
                                                <td width="50%" valign="top" style="padding-bottom: 20px;">
                                                    <p style="margin: 0 0 4px; color: #9ca3af; font-size: 12px; text-transform: uppercase; font-weight: 600;">Date</p>
                                                    <p style="margin: 0; color: #1f2937; font-weight: 700; font-size: 16px;">${new Date().toLocaleDateString()}</p>
                                                </td>
                                            </tr>
                                        </table>

                                        <div style="border-top: 1px solid #e5e7eb; margin-bottom: 24px;"></div>

                                        <!-- Items -->
                                        <h3 style="margin: 0 0 16px; color: #111827; font-size: 16px; font-weight: 700;">Order Summary</h3>
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            ${itemsHTML}
                                            <tr>
                                                <td colspan="2" style="padding-top: 20px; text-align: left; font-weight: 700; color: #1f2937; font-size: 18px;">Total</td>
                                                <td style="padding-top: 20px; text-align: right; font-weight: 700; color: #f97316; font-size: 18px;">LKR ${order.totalAmount.toLocaleString()}</td>
                                            </tr>
                                        </table>

                                        <div style="border-top: 1px solid #e5e7eb; margin: 24px 0;"></div>

                                        <!-- Delivery -->
                                        <h3 style="margin: 0 0 16px; color: #111827; font-size: 16px; font-weight: 700;">Delivery Address</h3>
                                        <p style="margin: 0 0 4px; color: #1f2937; font-weight: 600;">${order.deliveryDetails.fullName}</p>
                                        <p style="margin: 0 0 4px; color: #4b5563; font-size: 14px; line-height: 1.5;">${order.deliveryDetails.address}</p>
                                        <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.5;">${order.deliveryDetails.city}, ${order.deliveryDetails.postalCode}</p>
                                    </div>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #18181b; padding: 40px; text-align: center;">
                                    <p style="margin: 0 0 16px; color: #d4d4d8; font-size: 14px;">Need help? Contact us at support@burgerhouse.com</p>
                                    <p style="margin: 0; color: #71717a; font-size: 12px;">© ${new Date().getFullYear()} Burger House. All rights reserved.</p>
                                    <div style="margin-top: 24px;">
                                        <a href="#" style="color: #52525b; text-decoration: none; font-size: 12px; margin: 0 10px;">Privacy Policy</a>
                                        <a href="#" style="color: #52525b; text-decoration: none; font-size: 12px; margin: 0 10px;">Terms of Service</a>
                                    </div>
                                </td>
                            </tr>
                        </table>
                        
                    </td>
                </tr>
            </table>
        </div>
    </body>
    </html>
    `;
};

// Send order status email
export async function sendOrderStatusEmail(order: Order, status: OrderStatus): Promise<boolean> {
    try {
        // Check if Web3Forms API key is configured
        if (!process.env.WEB3FORMS_ACCESS_KEY) {
            console.warn('Web3Forms Access Key not configured. Skipping email notification.');
            return false;
        }

        const statusInfo = statusMessages[status];
        const html = generateEmailHTML(order, status);

        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                access_key: process.env.WEB3FORMS_ACCESS_KEY,
                email: order.email,
                subject: statusInfo.subject,
                message: html,
            }),
        });

        const result = await response.json();

        if (result.success) {
            console.log(`Order status email sent to ${order.email} for order ${order.orderNumber}.`);
            return true;
        } else {
            console.error('Error sending email via Web3Forms:', result);
            return false;
        }
    } catch (error) {
        console.error('Failed to send order status email:', error);
        return false;
    }
}
