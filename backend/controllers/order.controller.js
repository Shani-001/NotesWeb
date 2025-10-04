import { Order } from "../models/order.model.js";
import { Purchase } from "../models/purchase.model.js";

export const orderData = async (req, res) => {
  const order = req.body;
  try {
    const orderInfo = await Order.create(order);
    // console.log(orderInfo);
    const userId = orderInfo?.userId;
    const notesId = orderInfo?.notesId;
    res.status(201).json({ message: "Order Details: ", orderInfo });
    if (orderInfo) {
      await Purchase.create({ userId, notesId });
    }
  } catch (error) {
    console.log("Error in order: ", error);
    res.status(401).json({ errors: "Error in order creation" });
  }
};