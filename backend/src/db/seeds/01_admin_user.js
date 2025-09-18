const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
  const adminEmail = 'registrywithtaylor@gmail.com';

  const existingAdmin = await knex('users').where({ email: adminEmail }).first();
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Karma', 10);

    await knex('users').insert({
      name: 'Taylor (Admin)',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });

    console.log(`✅ Admin created: ${adminEmail}`);
  } else {
    console.log(`ℹ️ Admin already exists: ${adminEmail}`);
  }
};