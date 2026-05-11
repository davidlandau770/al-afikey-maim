import { GOOGLE_SHEET_URL } from "../../helpers/environments";
import { CustomError } from "../../utils/handleError";

export const sendOrderToSheetDAL = async (payload: any): Promise<void> => {
  try {
    const res = await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new CustomError(
        "שגיאה בתקשורת עם שרת ההזמנות",
        res.status,
        "GOOGLE_ERROR",
      );
    }

    const json = await res.json();

    if (json.result !== "success") {
      throw new CustomError(
        json.message || "חלה שגיאה ברישום ההזמנה",
        500,
        "GOOGLE_ERROR",
      );
    }
  } catch (error) {
    if (error instanceof CustomError) throw error;
    throw new CustomError("נכשלה ההתקשרות עם שרת גוגל", 503, "NETWORK_ERROR");
  }
};
