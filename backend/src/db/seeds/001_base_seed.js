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

  const adminUserId = (await knex('users')
    .insert({
      name: 'Taylor Vanderwolk',
      email: 'concierge@taylormadebaby.com',
      role: 'admin',
      invite_status: 'approved',
      nda_signed: true,
    })
    .returning('id'))[0].id;

  const mentorPasswordHash = await bcrypt.hash('mentorme', 10);
  const mentorUser = await knex('users')
    .insert({
      name: 'Morgan Ellis',
      email: 'mentor@taylormadebaby.com',
      role: 'mentor',
      invite_status: 'approved',
      nda_signed: true,
      password_hash: mentorPasswordHash,
    })
    .returning(['id', 'name']);

  await knex('mentors').insert({
    user_id: mentorUser[0].id,
    profile:
      'Former NICU nurse and certified sleep consultant helping first-time parents create calm routines and confident transitions from hospital to home.',
    specialties: JSON.stringify(['sleep coaching', 'fourth trimester planning', 'travel logistics']),
    availability: JSON.stringify([
      { day: 'tuesday', slots: ['10:00', '13:00'] },
      { day: 'thursday', slots: ['12:30', '15:30'] },
    ]),
    status: 'active',
  });

  const mentorAdminHash = await bcrypt.hash('Karma', 10);
  const mentorAdmin = await knex('users')
    .insert({
      name: 'Registry With Taylor',
      email: 'registrywithtaylor@gmail.com',
      role: 'mentor',
      invite_status: 'approved',
      nda_signed: true,
      password_hash: mentorAdminHash,
    })
    .returning(['id']);

  await knex('mentors').insert({
    user_id: mentorAdmin[0].id,
    profile:
      'Taylor-led mentor account covering concierge onboarding, VIP member support, and mentor circle administration.',
    specialties: JSON.stringify(['concierge onboarding', 'vip member support', 'mentor circle administration']),
    availability: JSON.stringify([
      { day: 'monday', slots: ['09:00', '14:00'] },
      { day: 'wednesday', slots: ['11:00', '16:00'] },
    ]),
    status: 'active',
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
      price_pilot: 3400,
      price_future: 4100,
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
      price_pilot: 950,
      price_future: 1200,
    },
    {
      name: 'Sip & See Production',
      category: 'events',
      description: 'Concepting, vendor coordination, bespoke favors, and on-site hosting support.',
      price_pilot: 1400,
      price_future: 1850,
    },
  ]);

  await knex('blog_posts').insert([
    {
      title: 'Registry Essentials Worth the Hype',
      slug: 'registry-essentials-worth-the-hype',
      content: 'From carriers to bottles... (seed content)',
      category: 'registry',
      author_id: adminUserId,
      visibility: 'public',
      published_at: knex.fn.now(),
    },
  ]);
};
