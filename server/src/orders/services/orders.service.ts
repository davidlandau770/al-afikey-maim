import crypto from "crypto";
import { SITE_URL, YAAD_MASOF, YAAD_KEY } from "../../helpers/environments";
import { sendOrderToSheetDAL } from "../dal/orders.dal";
import type { OrderBody } from "../types/order.types";

function buildPaymentUrl(order: OrderBody, orderNumber: number): string {
  const amount = order.total.toFixed(2);
  const orderStr = String(orderNumber);
  const signature = crypto
    .createHash("sha256")
    .update(YAAD_MASOF + YAAD_KEY + amount + orderStr)
    .digest("hex");

  const nameParts = order.customer.name.trim().split(/\s+/);
  const clientName = order.customer.name.trim();
  const clientLName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0];

  const params = new URLSearchParams({
    Amount:      amount,
    BOF:         "True",
    ClientLName: clientLName,
    ClientName:  clientName,
    Coin:        "1",
    Info:        `הזמנה ${orderNumber}`,
    Masof:       YAAD_MASOF,
    MoreData:    "True",
    Order:       orderStr,
    PageLang:    "HEB",
    Sign:        "True",
    Tash:        "1",
    UTF8:        "True",
    action:      "pay",
    cell:        order.customer.phone,
    city:        order.shipping.city || "",
    email:       order.customer.email,
    sendemail:   "False",
    street:      order.shipping.street || "",
    tmp:         "3",
    zip:         order.customer.zip || "",
    signature,
  });

  return `https://icom.yaad.net/cgi-bin/yaadpay/yaadpay3ds.pl?${params.toString()}`;
}

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

  return buildPaymentUrl(order, orderNumber);
};
