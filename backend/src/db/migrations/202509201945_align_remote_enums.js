exports.up = async (knex) => {
  const roleEnum = 'user_role';
  const labels = ['admin', 'mentor', 'client'];

  for (const label of labels) {
    await knex.raw(
      `DO $$ BEGIN
        IF EXISTS (
          SELECT 1
          FROM pg_type t
          JOIN pg_enum e ON t.oid = e.enumtypid
          WHERE t.typname = ?
        ) AND NOT EXISTS (
          SELECT 1
          FROM pg_type t
          JOIN pg_enum e ON t.oid = e.enumtypid
          WHERE t.typname = ? AND e.enumlabel = ?
        ) THEN
          ALTER TYPE ?? ADD VALUE ?;
        END IF;
      END $$;`,
      [roleEnum, roleEnum, label, roleEnum, label]
    );
  }
};

exports.down = async () => {
  // No-op: removing enum values is destructive and not required.
};
