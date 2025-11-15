-- Drop legacy registry tables and enum.
DROP TABLE IF EXISTS "RegistryNote";
DROP TABLE IF EXISTS "RegistryCatalogItem";
DROP TABLE IF EXISTS "RegistryItem";

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'RegistrySource'
  ) THEN
    DROP TYPE "RegistrySource";
  END IF;
END $$;
