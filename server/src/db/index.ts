import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { POSTGRES_CONNECTION_STRING, ADMIN_DEFAULT_PASSWORD } from "../helpers/environments";

const pool = new Pool({ connectionString: POSTGRES_CONNECTION_STRING });

export const init = async (): Promise<void> => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price NUMERIC NOT NULL,
      original_price NUMERIC,
      category TEXT NOT NULL,
      featured BOOLEAN NOT NULL DEFAULT false,
      pages INTEGER,
      image TEXT,
      sold_out BOOLEAN NOT NULL DEFAULT false,
      stock INTEGER,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS sold_out BOOLEAN NOT NULL DEFAULT false`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}'`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS banners (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      text TEXT,
      link TEXT,
      link_text TEXT,
      bg_color TEXT NOT NULL DEFAULT '#1B6B8A',
      bg_image TEXT,
      position INTEGER NOT NULL DEFAULT 0,
      active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`ALTER TABLE banners ADD COLUMN IF NOT EXISTS bg_image TEXT`);
  await pool.query(`ALTER TABLE banners ADD COLUMN IF NOT EXISTS image_height INTEGER`);
  await pool.query(`ALTER TABLE banners ADD COLUMN IF NOT EXISTS banner_link TEXT`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS game_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      game_type TEXT NOT NULL,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'admin'`);
  await pool.query(`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS phone TEXT`);
  await pool.query(`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS email TEXT`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      image TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      quote TEXT NOT NULL,
      name VARCHAR(200) NOT NULL,
      role VARCHAR(300) NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  const { rows: tRows } = await pool.query("SELECT 1 FROM testimonials LIMIT 1");
  if (tRows.length === 0) {
    const seed = [
      [
        `. . .שיטת "אפיקי צלילים" ידידותית ונעימה הן למורה והן לתלמיד. תכני הלימוד וצורת הוראתם וכמו כן ארגון הספרים ופירוט הנושאים המופיעים בהם עונים על הצרכים הבסיסיים של הקריטריונים שנקבעו על ידי ועדות שפירא ושמרון להוראת הקריאה. תכני הלימוד לקוחים מעולמו של התלמיד היהודי באשר הוא. שיטת הלימוד מעודדת פיתוח דרכי למידה וחשיבה עצמאיות ויכולת התמודדות עם טקסטים שונים. שיחות ראשוניות עם מורות המשתמשות בספרי "אפיקי צלילים" מאשרות שהשיטה עונה על צרכי תלמידים מוכשרים ומתקשים כאחד ומאפשרת לכלל תלמידי הכתה לרכוש את הקריאה בצורה שוטפת וראויה. . .`,
        "פרופ' יעקב כץ",
        'ביה"ס לחינוך אוניברסיטת בר-אילן',
      ],
      [
        `. . .השילוב של חוברות משחקים ולוח כיתתי, יחד עם ההדרכה האישית הניתנת למורים ולמרות המקנים את הקריאה במוסדות החינוך של "רשת מעיין החינוך התורני", הביאו למצב שבמספר בתי ספר הופסק הסיוע המיוחד לתלמידים המתקשים בקריאה, משום שכל ילדי כיתה א' רכשו את יכולת הקריאה בצורה טובה בכיתות האם שלה . . .`,
        "הרב יוסף פוליטי",
        "מפקח ארצי",
      ],
      [
        `. . .תוצאות השיטה על יתרונותיה הביאו למצב של סגירת כיתת הסיוע בקריאה ולשיפור ניכר בהבנת הנקרא. לימוד הקריאה בשיטה זו ידידותית מאוד וקליטה. הלימוד נעשה דרך משחק בצבעים ובמגוון רחב של איורים ואמצעי המחשה תוך שימוש בזיכרון החזותי, הילד מתחיל לקרוא מידי בתחילת הלימוד ויש לו ספוק מידי ועידוד להמשיך לקרוא . . .`,
        "הרב פילו ראובן יוסף",
        'מנהל חינוכי ת"ת "בניהו"',
      ],
      [
        `. . .הניסיון בשדה מלמד כי תחום הטיפול בילדים עם קשיי קריאה נרחב וכל מומחית ושיטתה. בהרבה מאד מקרים נוכחתי מקרוב מתוך הלמידה בתרומתה הגדולה של הגב' זהבה אוזן, לילדים שלא נעזרו בגישות אחרות ילדים עם קשיי קריאה ניכרים ועם פיגור קל ובשיטה זו נעזרו מאוד. . .`,
        "רינה שוורץ",
        "מורת שילוב בית מרגלית - אלעד",
      ],
      [
        `. . .הספר בנוי בצורה טובה, יש בו בנייה שיטתית של יסודות הקריאה, תכנית ההוראה מובנית ותהליכי הלימוד מוגשים לתלמיד בצורה מסודרת ביותר. בסיום כל שלב מופיעים לוחות תרגול לקריאה מדויקת. יש בספר חשיבות רבה, מגוון פעילויות ומשחקים. היא מציגה גישה מפורטת ומגוונת להוראת הקריאה בכיתה א'. הטקסטים המובאים בספר בהירים ביותר לקורא. התלמיד יכול לפענח ואף להבין מה שקרה בשלבים הראשונים של הקריאה. המדריך למורה בנוי כהלכה, יש בו מבוא תיאורטי מדויק וברור דיו. לאור כל האמור לעיל, אני שב וממליץ לפרסם את הספר הנדון, שלדעתי יתרום, ללא ספק, רבות לחינוכם הלשוני של תלמידי כיתה א בזרם הממלכתי דתי. . .`,
        "פרופ' דניאל סיון",
        "המחלקה ללשון עברית אוניברסיטת בן גוריון באר שבע",
      ],
    ];
    for (const [quote, name, role] of seed) {
      await pool.query("INSERT INTO testimonials (quote, name, role) VALUES ($1, $2, $3)", [quote, name, role]);
    }
  }

  const { rows: adminRows } = await pool.query("SELECT 1 FROM admin_users WHERE role = 'owner'");
  if (adminRows.length === 0) {
    const { rowCount } = await pool.query("UPDATE admin_users SET role = 'owner' WHERE username = 'admin'");
    if ((rowCount ?? 0) === 0) {
      const hash = await bcrypt.hash(ADMIN_DEFAULT_PASSWORD, 12);
      await pool.query(
        "INSERT INTO admin_users (username, password_hash, role) VALUES ('developer', $1, 'owner')",
        [hash],
      );
      console.log("Owner user created. Username: developer | Password:", ADMIN_DEFAULT_PASSWORD);
    }
  }
  // Migrate owner username to 'developer'
  await pool.query("UPDATE admin_users SET username = 'developer' WHERE role = 'owner' AND username IN ('admin', 'מפתח')");

  // Always sync owner password from env
  const ownerHash = await bcrypt.hash(ADMIN_DEFAULT_PASSWORD, 12);
  await pool.query("UPDATE admin_users SET password_hash = $1 WHERE role = 'owner'", [ownerHash]);
};

export default pool;
