import { Request, Response } from "express";
import { handleError, CustomError } from "../../utils/handleError";
import { sendContactEmailService } from "../services/contact.service";
import { ContactFormBody } from "../types/contact.types";

export const sendContactController = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message }: ContactFormBody = req.body;

    if (!name || !email || !message) {
      throw new CustomError("כל השדות נדרשים", 400, "CONTACT");
    }

    await sendContactEmailService(name, email, message, phone);
    res.status(200).json({ message: "ההודעה נשלחה בהצלחה" });
  } catch (error) {
    handleError(res, error, 500, "CONTACT");
  }
};
