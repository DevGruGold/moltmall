-- Run this in the Supabase Dashboard SQL Editor
-- (https://supabase.com/dashboard/project/tqkpiofrigicsnkmclns/sql)

GRANT ALL ON SCHEMA public TO moltmall_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO moltmall_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO moltmall_app;

-- If you want to allow the app to create extensions (optional, usually not recommended for app users)
-- ALTER USER moltmall_app WITH CREATEDB; 
-- OR execute extensions as postgres/superuser
