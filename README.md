# אתר פורטפוליו למפתח אתרים

פרויקט זה מכיל אתר פורטפוליו מלא עם React בחזית ו-Express בשרת, הכולל טופס יצירת קשר.

## מבנה הפרויקט

- `client/` - אפליקציית React עם Vite
- `server/` - שרת Express.js עם TypeScript

## התקנה והרצה

1. התקן תלויות בשני התיקיות:

   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

2. הרץ את השרת:

   ```bash
   cd server && npm run dev
   ```

3. הרץ את הלקוח (בטרמינל נפרד):
   ```bash
   cd client && npm run dev
   ```

האתר יהיה זמין בכתובת http://localhost:5174

## טכנולוגיות

- **Frontend**: React, TypeScript, Material-UI, Vite
- **Backend**: Express.js, TypeScript, PostgreSQL (אופציונלי)
- **כלים**: ESLint, Vite

## תכונות

- עיצוב רספונסיבי
- טופס יצירת קשר עם אימות
- חלקים: בית, אודות, פרויקטים, יצירת קשר
- שפה עברית
