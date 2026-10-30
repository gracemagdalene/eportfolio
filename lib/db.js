import postgres from 'postgres';

let sqlClient;
let ready;

// Supabase links sometimes carry extra options that the driver does not understand
function cleanUrl(raw) {
  const u = new URL(raw);
  u.searchParams.delete('supa');
  u.searchParams.delete('sslmode');
  return u.toString();
}

function client() {
  if (!sqlClient) {
    const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!url) throw new Error('DATABASE_URL is not set. Add your Supabase connection string in the Vercel project settings.');
    sqlClient = postgres(cleanUrl(url), { ssl: 'require', prepare: false, max: 1, idle_timeout: 20, connect_timeout: 15 });
  }
  return sqlClient;
}

async function init(sql) {
  await sql`CREATE TABLE IF NOT EXISTS settings (skey TEXT PRIMARY KEY, svalue TEXT)`;
  await sql`CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, message TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now())`;
  await sql`CREATE TABLE IF NOT EXISTS achievements (id SERIAL PRIMARY KEY, title TEXT NOT NULL, organization TEXT, period TEXT, description TEXT, evidence_url TEXT, created_at TIMESTAMPTZ DEFAULT now())`;
  await sql`CREATE TABLE IF NOT EXISTS projects (id SERIAL PRIMARY KEY, title TEXT NOT NULL, description TEXT, link TEXT, created_at TIMESTAMPTZ DEFAULT now())`;
  await sql`CREATE TABLE IF NOT EXISTS qualifications (id SERIAL PRIMARY KEY, title TEXT NOT NULL, institution TEXT, period TEXT, details TEXT, created_at TIMESTAMPTZ DEFAULT now())`;
  // Security: Supabase exposes tables through a public API. Row Level Security with no policies
  // blocks that API completely; this website still works because it connects directly.
  for (const t of ['settings', 'messages', 'achievements', 'projects', 'qualifications']) {
    await sql.unsafe(`ALTER TABLE ${t} ENABLE ROW LEVEL SECURITY`);
  }
  // Two sample projects, added only the first time
  const seeded = await sql`SELECT 1 FROM settings WHERE skey = 'projects_seeded'`;
  if (seeded.length === 0) {
    await sql`INSERT INTO projects (title, description) VALUES ('ePortfolio Website', 'My personal portfolio website with an administrator login for updating content. Built with Next.js, JavaScript, CSS and a Postgres database.')`;
    await sql`INSERT INTO projects (title, description) VALUES ('FreshBite Kenya', 'Food ordering website with a customer site and an admin dashboard. Built with PHP, MySQL and XAMPP.')`;
    await sql`INSERT INTO settings (skey, svalue) VALUES ('projects_seeded', '1')`;
  }
}

// Returns the SQL client after making sure the tables exist
export async function db() {
  const sql = client();
  if (!ready) ready = init(sql).catch((e) => { ready = null; throw e; });
  await ready;
  return sql;
}
