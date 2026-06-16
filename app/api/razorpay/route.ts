import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST() {
  try {
    // Razorpay ko initialize kar rahe hain aapki keys ke sath
    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // 25 Rupees ka order (Razorpay paise mein count karta hai, toh 25 * 100 = 2500)
    const options = {
      amount: 2500, 
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    };

    const order = await instance.orders.create(options);

    // Frontend ko order details bhej do
    return NextResponse.json(order);
  } catch (error) {
    console.error("Razorpay Error:", error);
    return NextResponse.json(
      { error: "Order generate nahi hua" },
      { status: 500 }
    );
  }
}