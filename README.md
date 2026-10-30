# ePortfolio (Next.js + Supabase) – deploy on Vercel

Pages: Home, About Me, Education, Skills, Projects, Achievements, CV, Contact Me.
Administrator dashboard: `/admin/login` (there is no link to it on the public site).

## 1. Put the code on GitHub
Unzip this folder. On github.com create a new repository, choose "uploading an existing file",
drag in ALL the files and folders from inside `eportfolio-next` (including `app`, `components`, `lib`
and the hidden files) and press Commit.

## 2. Deploy on Vercel
vercel.com > Add New > Project > import the repository > Deploy.
(The first deploy can work without settings; the site just shows the default text until step 3 is done.)

## 3. Add these Environment Variables (Vercel project > Settings > Environment Variables)
| Name | Where to get it |
|---|---|
| ADMIN_PASSWORD | A long, private password you choose |
| SESSION_SECRET | Any long random text |
| DATABASE_URL | Supabase > Connect > Transaction pooler > copy the connection string and replace [YOUR-PASSWORD] |
| SUPABASE_URL | Supabase > Project Settings > API > Project URL |
| SUPABASE_SERVICE_ROLE_KEY | Supabase > Project Settings > API Keys > service_role (secret) key |

If you connected Supabase through Vercel's Storage/Integrations tab, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
and POSTGRES_URL are added for you, so you only need ADMIN_PASSWORD and SESSION_SECRET.
If your database password has special characters (such as @ or #), reset it to letters and numbers only.

## 4. Redeploy
Deployments > latest > Redeploy. Open `https://YOUR-SITE.vercel.app/admin/login`.
The database tables and the file storage bucket are created automatically on first use.
Keep SUPABASE_SERVICE_ROLE_KEY secret: never put it in the code or share it.
