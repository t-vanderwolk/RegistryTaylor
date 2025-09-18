const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
  const mentorEmail = 'mentor@taylormadebabyco.com';

  const existingMentor = await knex('users').where({ email: mentorEmail }).first();
  if (!existingMentor) {
    const hashedPassword = await bcrypt.hash('MentorPass123', 10);

    await knex('users').insert({
      name: 'Taylor-Made Mentor',
      email: mentorEmail,
      password: hashedPassword,
      role: 'mentor',
    });

    console.log(`✅ Mentor created: ${mentorEmail}`);
  } else {
    console.log(`ℹ️ Mentor already exists: ${mentorEmail}`);
  }
};