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
  const hasBlogPosts = await knex.schema.hasTable('blog_posts');
  if (hasBlogPosts) {
    await knex('blog_posts').del().catch(() => {});
  }
  const hasBlogQuestions = await knex.schema.hasTable('blog_questions');
  if (hasBlogQuestions) {
    await knex('blog_questions').del().catch(() => {});
  }
  const hasForumPosts = await knex.schema.hasTable('private_blog_posts');
  if (hasForumPosts) {
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
      requested_role: 'client',
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
      requested_role: 'client',
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

  if (hasBlogPosts) {
    await knex('blog_posts').insert([
      {
        id: uuid(),
        title: 'Mentor Notes: Nursery Glow-Up Checklist',
        slug: 'mentor-notes-nursery-glow-up',
        category: 'Mentor Notes',
        excerpt: 'Morgan shares the five glam touches that transform any nursery into a serene retreat.',
        content:
          'Our mentor Morgan rounded up the design cues we rely on when polishing nurseries for high-touch families. From scent layering to textile elevations, here is how to recreate the Taylor-Made glow ahead of baby’s arrival.',
        visibility: 'members_only',
        author_id: mentorId,
      },
    ]);
  }

  if (hasForumPosts) {
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

  if (hasBlogQuestions) {
    await knex('blog_questions').insert([
      {
        id: uuid(),
        username: 'HarperL',
        email: 'harper@example.com',
        question: 'Any tips for balancing registry items across price points while keeping it cohesive?',
        answer:
          'Start with the heirloom-level pieces you truly want, then layer mid-range essentials and sprinkle in luxe upgrades. I create palette + material guardrails so even a mix of retailers still feels intentional.',
        status: 'published',
      },
      {
        id: uuid(),
        username: 'JordanR',
        email: 'jordan@example.com',
        question: 'How early should we lock-in nursery styling if we want a full install?',
        answer: null,
        status: 'pending',
      },
    ]);
  }
};
