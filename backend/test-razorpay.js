import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

async function verifyKeys() {
    console.log(`Checking Razorpay Keys:`);
    console.log(`Key ID: ${key_id ? key_id.substring(0, 10) + '...' : 'MISSING'}`);
    console.log(`Key Secret: ${key_secret ? '*******' : 'MISSING'}`);

    if (!key_id || key_id.includes('your_razorpay') || !key_secret || key_secret.includes('your_razorpay')) {
        console.log('❌ Error: Keys are still placeholders or missing.');
        return;
    }

    try {
        const razorpay = new Razorpay({ key_id, key_secret });
        // Attempt to fetch a random order to check if auth works
        // Fetching orders is a good way to test credentials
        const orders = await razorpay.orders.all({ count: 1 });
        console.log('✅ Success: Razorpay credentials are valid!');
    } catch (error) {
        console.log(`❌ Fail: ${error.error?.description || error.message}`);
        if (error.error?.code === 'BAD_REQUEST_ERROR') {
            console.log('Note: This could be due to lack of previous orders, but successfully connecting implies valid keys.');
        }
    }
}

verifyKeys();
