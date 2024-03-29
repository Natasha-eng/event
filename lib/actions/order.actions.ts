"use server";
import Stripe from "stripe";

import { CheckoutOrderParams, CreateOrderParams } from "@/types";
import { redirect } from "next/navigation";
import { handleError } from "../utils";
import { base } from "../airtableDB/database";
import { minifyRecordData } from "./user.actions";
import { FieldSet, Record } from "airtable";

export const checkoutOrder = async (order: CheckoutOrderParams) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const price = order.isFree ? 0 : Number(order.price) * 100;
  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price_data: {
            currency: "usd",
            unit_amount: price,
            product_data: {
              name: order.eventTitle,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        eventId: order.eventId!,
        buyerId: order.buyerId,
      },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });
    redirect(session.url!);
  } catch (err) {
    throw err;
  }
};

export const createOrder = async (order: Partial<FieldSet>) => {
  try {
    const newOrderData = await base("order").create({
      ...order,
      eventId: order.eventId,
      buyerId: order.buyerId,
    });
    const newOrder = minifyRecordData(newOrderData);
    return newOrder;
  } catch (err) {
    handleError(err);
  }
};
