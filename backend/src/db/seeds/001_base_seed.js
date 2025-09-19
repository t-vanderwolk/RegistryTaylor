const bcrypt = require('bcrypt');

exports.seed = async (knex) => {
  await knex('documents').del();
  await knex('consultations').del();
  await knex('mentors').del();
  await knex('blog_posts').del();
  await knex('add_ons').del();
  await knex('membership_packages').del();
  await knex('invites').del();
  await knex('users').del();

<<<<<<< HEAD
  const seedPassword = process.env.SEED_DEFAULT_PASSWORD || 'Karma';

  const adminPassword = process.env.SEED_ADMIN_PASSWORD || seedPassword;
  const adminHash = await bcrypt.hash(adminPassword, 10);
  const adminUser = (await knex('users')
    .insert({
      name: 'Admin User',
=======
  const adminHash = await bcrypt.hash('Karma', 10);
  const adminUser = (await knex('users')
    .insert({
      name: 'Taylor Vanderwolk',
>>>>>>> 03d1865430fc68c3db1d93d0009a43d4ff4fef6d
      email: 'admin@me.com',
      role: 'admin',
      invite_status: 'approved',
      nda_signed: true,
      password_hash: adminHash,
    })
    .returning(['id']))[0];

<<<<<<< HEAD
  const mentorPassword = process.env.SEED_MENTOR_PASSWORD || seedPassword;
  const mentorHash = await bcrypt.hash(mentorPassword, 10);
=======
  const mentorHash = await bcrypt.hash('Karma', 10);
>>>>>>> 03d1865430fc68c3db1d93d0009a43d4ff4fef6d
  const mentorUser = (await knex('users')
    .insert({
      name: 'Morgan Ellis',
      email: 'mentor@me.com',
      role: 'mentor',
      invite_status: 'approved',
      nda_signed: true,
      password_hash: mentorHash,
    })
    .returning(['id']))[0];

  await knex('mentors').insert({
    user_id: mentorUser.id,
    profile:
      'Former NICU nurse and certified sleep consultant helping first-time parents create calm routines and confident transitions from hospital to home.',
    specialties: JSON.stringify(['sleep coaching', 'fourth trimester planning', 'travel logistics']),
    availability: JSON.stringify([
      { day: 'tuesday', slots: ['10:00', '13:00'] },
      { day: 'thursday', slots: ['12:30', '15:30'] },
    ]),
    status: 'active',
  });

<<<<<<< HEAD
  const clientPassword = process.env.SEED_CLIENT_PASSWORD || seedPassword;
  const clientHash = await bcrypt.hash(clientPassword, 10);
  const clientUser = (await knex('users')
    .insert({
      name: 'Avery Parker',
      email: 'client@me.com',
      role: 'member',
      invite_status: 'approved',
      nda_signed: false,
      package_selected: 'signature',
      password_hash: clientHash,
    })
    .returning(['id']))[0];

  await knex('consultations').insert({
    member_id: clientUser.id,
    consultant_id: mentorUser.id,
    date_time: knex.fn.now(),
    status: 'completed',
    notes_encrypted: null,
  });

  await knex('documents').insert({
    user_id: clientUser.id,
    file_url: 'https://taylormadebaby.com/documents/avery-parker-nda.pdf',
    document_type: 'nda',
    signed_at: knex.fn.now(),
=======
  const memberHash = await bcrypt.hash('Karma', 10);
  await knex('users').insert({
    name: 'Taylor-Made Member',
    email: 'user@me.com',
    role: 'member',
    invite_status: 'approved',
    nda_signed: true,
    package_selected: 'signature',
    password_hash: memberHash,
>>>>>>> 03d1865430fc68c3db1d93d0009a43d4ff4fef6d
  });

  await knex('membership_packages').insert([
    {
      name: 'Essentials',
      description: 'Registry mastery, personal shopping, and concierge returns handled for you.',
      price_pilot: 1950,
      price_future: 2400,
      included_services: JSON.stringify([
        'Curated multi-retailer registry management',
        'One virtual or in-home consultation',
        'White-glove returns and exchanges',
      ]),
    },
    {
      name: 'Signature',
      description: 'Essentials plus nursery design, in-home styling, and family integration guidance.',
      price_pilot: 3000,
      price_future: 3600,
      included_services: JSON.stringify([
        'Everything in Essentials',
        'Nursery design concepts and sourcing',
        'Travel preparation concierge',
      ]),
    },
    {
      name: 'Bespoke',
      description: 'Invite-only concierge experience for limitless support and discretion.',
      price_pilot: 0,
      price_future: 0,
      included_services: JSON.stringify([
        'Everything in Signature',
        'Custom events and gifting management',
        'Quarterly planning intensives',
      ]),
    },
  ]);

  await knex('add_ons').insert([
    {
      name: 'Full Nursery Install',
      category: 'nursery',
      description: 'Furniture sourcing, white-glove delivery coordination, and styling.',
      price_pilot: 730,
      price_future: 1060,
    },
    {
      name: 'Sip & See Production',
      category: 'events',
      description: 'Concepting, vendor coordination, bespoke favors, and on-site hosting support.',
      price_pilot: 1075,
      price_future: 1630,
    },
  ]);

  await knex('blog_posts').insert([
    {
      title: 'Registry Essentials Worth the Hype',
      slug: 'registry-essentials-worth-the-hype',
      content: 'From carriers to bottles... (seed content)',
      category: 'registry',
      author_id: adminUser.id,
      visibility: 'public',
      published_at: knex.fn.now(),
    },
  ]);
};
