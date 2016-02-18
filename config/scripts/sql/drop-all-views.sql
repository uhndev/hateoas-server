DO $$DECLARE r record;
BEGIN
  FOR r IN SELECT schemaname, viewname
    FROM pg_catalog.pg_views
    WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
    ORDER BY schemaname, viewname
  LOOP
    EXECUTE 'DROP VIEW IF EXISTS ' || r.schemaname || '.' || r.viewname || ';';
  END LOOP;
END$$;
