const db = require('../connection');

const DEMO_INVITES = [
  {
    name: 'Harper James',
    email: 'harper.james@email.com',
    due_date: new Date('2024-09-01'),
    message: 'Preparing for our first little one—excited to design a serene nursery.',
    created_at: new Date('2024-06-12T16:30:00Z'),
  },
  {
    name: 'Sloane Rivera',
    email: 'sloane.rivera@email.com',
    due_date: new Date('2024-11-18'),
    message: 'Looking for registry support that balances city life with travel.',
    created_at: new Date('2024-06-18T12:00:00Z'),
  },
  {
    name: 'Avery Patel',
    email: 'avery.patel@email.com',
    due_date: new Date('2025-01-05'),
    message: 'Interested in postpartum rituals and mentor-led gear guidance.',
    created_at: new Date('2024-06-21T09:45:00Z'),
  },
];

async function seedInviteRequests() {
  for (const request of DEMO_INVITES) {
    const existing = await db('invite_requests').where({ email: request.email }).first();
    if (existing) {
      await db('invite_requests')
        .where({ email: request.email })
        .update({
          name: request.name,
          due_date: request.due_date,
          message: request.message,
          created_at: request.created_at,
        });
    } else {
      await db('invite_requests').insert(request);
    }
  }
}

module.exports = seedInviteRequests;
