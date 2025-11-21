import crypto from "crypto";

const FLUTTERWAVE_SECRET = process.env.FLUTTERWAVE_SECRET_KEY || '';
const FLUTTERWAVE_PUBLIC = process.env.FLUTTERWAVE_PUBLIC_KEY || '';

export interface FlutterwaveInitRequest {
  email: string;
  amount: number;
  planType: string;
  userId: string;
}

export interface FlutterwaveTransaction {
  id: number;
  reference: string;
  status: string;
  amount: number;
  customer: {
    email: string;
    name: string;
  };
}

/**
 * Initialize Flutterwave payment
 */
export async function initializeFlutterwavePayment(data: FlutterwaveInitRequest) {
  if (!FLUTTERWAVE_PUBLIC) {
    throw new Error('Flutterwave not configured');
  }

  const payload = {
    public_key: FLUTTERWAVE_PUBLIC,
    tx_ref: `kudimanager_${Date.now()}_${data.userId}`,
    amount: data.amount,
    currency: 'NGN',
    payment_options: 'card,banktransfer,ussd,paysplit',
    redirect_url: `${process.env.FLW_CALLBACK_URL || 'http://localhost:5000'}/subscription`,
    customer: {
      email: data.email,
      name: data.email.split('@')[0],
    },
    meta: {
      userId: data.userId,
      planType: data.planType,
    },
    customizations: {
      title: 'KudiManager Subscription',
      description: `${data.planType} Plan`,
      logo: 'https://kudimanager.com/logo.png',
    },
  };

  return {
    success: true,
    link: `https://checkout.flutterwave.com/?txref=${payload.tx_ref}&public_key=${FLUTTERWAVE_PUBLIC}`,
    tx_ref: payload.tx_ref,
  };
}

/**
 * Verify Flutterwave transaction
 */
export async function verifyFlutterwaveTransaction(transactionId: string) {
  if (!FLUTTERWAVE_SECRET) {
    throw new Error('Flutterwave not configured');
  }

  try {
    const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${FLUTTERWAVE_SECRET}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Flutterwave verification failed: ${response.statusText}`);
    }

    const data = await response.json() as any;
    return {
      success: data.status === 'success',
      transaction: data.data,
      reference: data.data.tx_ref,
    };
  } catch (error) {
    console.error('[FLUTTERWAVE] Verification error:', error);
    throw error;
  }
}

/**
 * Verify Flutterwave webhook signature
 */
export function verifyFlutterwaveWebhookSignature(
  payload: string,
  signature: string
): boolean {
  if (!FLUTTERWAVE_SECRET) {
    console.error('[FLUTTERWAVE] Secret key not configured');
    return false;
  }

  const hash = crypto
    .createHmac('sha256', FLUTTERWAVE_SECRET)
    .update(payload)
    .digest('hex');

  return hash === signature;
}

/**
 * Plan pricing configuration
 */
export const FLUTTERWAVE_PLANS = {
  basic: {
    name: 'Basic',
    price: 2500,
    currency: 'NGN',
    duration: 'month',
    features: [
      'Up to 100 products',
      'Sales & expense tracking',
      'Inventory management',
      'Basic reports',
    ],
  },
  premium: {
    name: 'Premium',
    price: 5000,
    currency: 'NGN',
    duration: 'month',
    features: [
      'Unlimited products',
      'Advanced analytics',
      'AI business advisor',
      'Vendor recommendations',
      'Priority support',
    ],
  },
};
