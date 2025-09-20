exports.up = async (knex) => {
  const roleEnum = 'user_role';
  const labels = ['admin', 'mentor', 'client'];

  for (const label of labels) {
    const result = await knex
      .select('e.enumlabel')
      .from('pg_type as t')
      .join('pg_enum as e', 't.oid', 'e.enumtypid')
      .where('t.typname', roleEnum)
      .andWhere('e.enumlabel', label)
      .first();

    if (!result) {
      await knex.raw(`ALTER TYPE "${roleEnum}" ADD VALUE '${label}'`);
    }
  }
};

exports.down = async () => {
  // Enum values cannot be easily removed. No-op.
};
