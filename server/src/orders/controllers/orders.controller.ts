import { Request, Response } from "express";
import { handleError, CustomError } from "../../utils/handleError";
import { createOrderService } from "../services/orders.service";
import type { OrderBody } from "../types/order.types";

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const body: OrderBody = req.body;

    if (
      !body.customer?.name ||
      !body.customer?.phone ||
      !body.customer?.email
    ) {
      throw new CustomError("פרטי לקוח חסרים", 400, "ORDERS");
    }
    if (!body.items?.length) {
      throw new CustomError("ההזמנה ריקה", 400, "ORDERS");
    }

    const paymentUrl = await createOrderService(body);
    res.status(201).json({ paymentUrl });
  } catch (error) {
    handleError(res, error, 500, "ORDERS");
  }
};
