import { SITE_URL } from "../../helpers/environments";
import { sendOrderToSheetDAL } from "../dal/orders.dal";
import type { OrderBody } from "../types/order.types";

export const createOrderService = async (order: OrderBody): Promise<string> => {
  const siteName = "על אפיקי מים";
  const clientId = "al_afikey_maim";
  const orderNumber = 1000 + Math.floor(Math.random() * 9000);

  const itemsList = order.items
    .map((item) => `${item.name} x${item.quantity}`)
    .join(", ");

  const clientEmailSubject = `אישור הזמנה מס' ${orderNumber} - ${siteName}`;

  const itemsHtml = order.items
    .map(
      (item) =>
        `<li>${item.name} - ${item.quantity} יח' (${item.price * item.quantity} ₪)</li>`,
    )
    .join("");

  const clientEmailHtml = `
    <div dir="rtl" style="font-family: sans-serif; text-align: right; line-height: 1.6;">
      <h2 style="color: #2c3e50;">תודה על הזמנתך, ${order.customer.name}!</h2>
      <p>שמחים לעדכן שההזמנה שלך התקבלה במערכת ומעובדת כעת.</p>
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-right: 5px solid #007bff;">
        <h4 style="margin-top: 0;">פירוט ההזמנה:</h4>
        <ul style="list-style: none; padding: 0;">${itemsHtml}</ul>
        <p><strong>סה"כ לתשלום:</strong> ₪${order.total}</p>
        <p><strong>שיטת משלוח:</strong> ${order.shipping.type === "delivery" ? "משלוח לכתובת: " + order.shipping.address : "איסוף עצמי"}</p>
      </div>

      ${order.notes ? `<p><strong>הערות שלך:</strong> ${order.notes}</p>` : ""}

      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p>נציג שלנו יצור איתך קשר במידת הצורך לתיאום סופי.</p>
      <p>בברכה,<br /><strong>${siteName}</strong></p>
      
      <a href="https://${SITE_URL}" style="color: #007bff; text-decoration: none; font-weight: bold;">חזרה לאתר: ${SITE_URL}</a>
    </div>
  `;

  await sendOrderToSheetDAL({
    clientId,
    name: order.customer.name,
    email: order.customer.email.toLowerCase().trim(),
    phone: order.customer.phone,
    message: `הזמנה: ${itemsList}. סה"כ: ${order.total} ₪. הערות: ${order.notes || "אין"}`,
    clientEmailSubject,
    clientEmailHtml,
  });

  return "";
};
