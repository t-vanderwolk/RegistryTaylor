const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
  const clientEmail = 'client@taylormadebabyco.com';

  const existingClient = await knex('users').where({ email: clientEmail }).first();
  if (!existingClient) {
    const hashedPassword = await bcrypt.hash('ClientPass123', 10);

    await knex('users').insert({
      name: 'Taylor-Made Client',
      email: clientEmail,
      password: hashedPassword,
      role: 'client',
    });

    console.log(`✅ Client created: ${clientEmail}`);
  } else {
    console.log(`ℹ️ Client already exists: ${clientEmail}`);
  }
};