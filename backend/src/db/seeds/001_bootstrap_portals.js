const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');

const defaultPassword = process.env.SEED_DEFAULT_PASSWORD || 'Karma';
const hashPassword = (password) => bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS || 12));

exports.seed = async (knex) => {
  await knex('messages').del().catch(() => {});
  await knex('mentor_assignments').del().catch(() => {});
  await knex('mentor_profiles').del().catch(() => {});
  await knex('client_profiles').del().catch(() => {});
  await knex('invite_codes').del().catch(() => {});
  await knex('invite_requests').del().catch(() => {});
  await knex('users').del().catch(() => {});
  const hasPrivateBlog = await knex.schema.hasTable('private_blog_posts');
  if (hasPrivateBlog) {
    await knex('private_blog_posts').del().catch(() => {});
  }

  const [adminId, mentorId, clientId] = [uuid(), uuid(), uuid()];
  const passwordHash = await hashPassword(defaultPassword);

  await knex('users').insert([
    {
      id: adminId,
      name: 'Taylor Concierge',
      email: 'Admin@me.com',
      password_hash: passwordHash,
      role: 'admin',
      phone: '4805550100',
      zip_code: '85251',
      active: true,
    },
    {
      id: mentorId,
      name: 'Morgan Ellis',
      email: 'Mentor@me.com',
      password_hash: passwordHash,
      role: 'mentor',
      phone: '4805550200',
      zip_code: '85253',
      active: true,
    },
    {
      id: clientId,
      name: 'Avery Parker',
      email: 'Client@me.com',
      password_hash: passwordHash,
      role: 'client',
      phone: '4805550300',
      zip_code: '85254',
      active: true,
    },
  ]);

  await knex('mentor_profiles').insert({
    user_id: mentorId,
    specialty: 'Registry curation & nursery design',
    bio: 'Certified baby concierge guiding families from registry to nursery reveal.',
    availability: 'Mon-Fri 09:00-16:00 MST',
    max_clients: 8,
    certifications: JSON.stringify(['Doula Certified', 'Sleep Consultant']),
  });

  await knex('client_profiles').insert({
    user_id: clientId,
    parent_one_name: 'Avery Parker',
    parent_two_name: 'Jordan Parker',
    baby_name: 'Baby Parker',
    baby_gender: 'Girl',
    due_date: '2025-02-14',
    package_choice: 'Signature Taylor-Made',
    mentor_preference: 'Morgan Ellis',
    family_intro:
      'We are blending modern desert neutrals with sentimental heirlooms and would love extra guidance on registry experiences.',
  });

  await knex('mentor_assignments').insert({
    mentor_id: mentorId,
    client_id: clientId,
  });

  await knex('invite_codes').insert([
    {
      code: 'ADMIN-ONBOARD-001',
      role: 'admin',
      assigned_name: 'Taylor Concierge',
      assigned_email: 'Admin@me.com',
      single_use: true,
      metadata: { origin: 'seed' },
    },
    {
      code: 'MENTOR-GOLD-001',
      role: 'mentor',
      assigned_name: 'Morgan Ellis',
      assigned_email: 'Mentor@me.com',
      single_use: true,
      metadata: { specialty: 'Registry curation & nursery design' },
    },
    {
      code: 'CLIENT-VIP-001',
      role: 'client',
      assigned_name: 'Avery Parker',
      assigned_email: 'Client@me.com',
      single_use: true,
      metadata: {
        package_choice: 'Signature Taylor-Made',
        mentor_preference: 'Morgan Ellis',
        due_date: '2025-02-14',
      },
    },
  ]);

  await knex('invite_requests').insert([
    {
      id: uuid(),
      name: 'Jordan Blake',
      email: 'jordan@example.com',
      zip_code: '85255',
      package_choice: 'Signature Taylor-Made',
      status: 'pending',
    },
    {
      id: uuid(),
      name: 'Sam Riley',
      email: 'sam@example.com',
      zip_code: '85258',
      package_choice: 'Concierge Essentials',
      status: 'approved',
      generated_code: 'CLT-INVITE',
      handled_at: knex.fn.now(),
    },
  ]);

  await knex('messages').insert([
    {
      id: uuid(),
      thread_id: clientId,
      sender_id: mentorId,
      body: 'Hi Avery! Excited to plan our next nursery styling session.',
      read: false,
    },
    {
      id: uuid(),
      thread_id: clientId,
      sender_id: clientId,
      body: 'Hi Morgan! Thank you — Tuesday afternoon works great for us.',
      read: false,
    },
  ]);

  if (hasPrivateBlog) {
    await knex('private_blog_posts').insert([
      {
        id: uuid(),
        title: 'Welcome to the Taylor-Made Lounge',
        category: 'Announcements',
        content:
          'Avery, your concierge circle is officially live! Peek at the curated timeline inside the client portal and drop a note if you need anything smoothed out before next week.’',
        author_id: adminId,
      },
      {
        id: uuid(),
        title: 'Mentor Insights: Week 24 Highlights',
        category: 'Mentor Notes',
        content:
          'Morgan here — baby goods arriving Wednesday. I added three registry swaps based on your feedback. Full notes are inside the client dashboard.',
        author_id: mentorId,
      },
    ]);
  }
};
