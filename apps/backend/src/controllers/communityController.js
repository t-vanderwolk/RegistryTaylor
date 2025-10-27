const db = require('../db/connection');

const mentorRoles = new Set(['mentor', 'admin']);

const pickTargetUserId = (req) => {
  const { userId } = req.query;
  if (userId && mentorRoles.has(req.user.role)) {
    return userId;
  }
  return req.user.id;
};

const findMentor = async (clientId) =>
  db('mentor_assignments as ma')
    .join('users as m', 'm.id', 'ma.mentor_id')
    .leftJoin('mentor_profiles as mp', 'mp.user_id', 'm.id')
    .select(
      'm.id',
      'm.name',
      'm.email',
      'm.phone',
      'mp.specialty',
      'mp.availability'
    )
    .where('ma.client_id', clientId)
    .first();

exports.getOverview = async (req, res, next) => {
  try {
    const targetUserId = pickTargetUserId(req);

    const [profile, mentor, events, announcements, threads] = await Promise.all([
      db('client_profiles').where({ user_id: targetUserId }).first(),
      findMentor(targetUserId),
      db('community_events')
        .where('starts_at', '>=', db.fn.now())
        .orderBy('starts_at', 'asc')
        .limit(5),
      db('private_blog_posts')
        .whereIn('category', ['announcement', 'community'])
        .orderBy('created_at', 'desc')
        .limit(4),
      db('messages as m')
        .join('users as sender', 'sender.id', 'm.sender_id')
        .select(
          'm.id',
          'sender.name as sender_name',
          'sender.role as sender_role',
          'm.body',
          'm.created_at'
        )
        .where('m.thread_id', targetUserId)
        .orderBy('m.created_at', 'desc')
        .limit(5),
    ]);

    res.json({
      data: {
        mentor: mentor || null,
        profile: profile
          ? {
              mentorEligible: Boolean(profile.mentor_eligible),
              mentorEligibleAt: profile.mentor_eligible_at,
              coreModulesCompleted: profile.core_modules_completed || 0,
            }
          : {
              mentorEligible: false,
              mentorEligibleAt: null,
              coreModulesCompleted: 0,
            },
        events: events.map((event) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          eventType: event.event_type,
          startsAt: event.starts_at,
          endsAt: event.ends_at,
          location: event.location,
          virtual: event.virtual,
          featured: event.featured,
        })),
        announcements: announcements.map((announcement) => ({
          id: announcement.id,
          title: announcement.title,
          category: announcement.category,
          createdAt: announcement.created_at,
          excerpt: announcement.content.slice(0, 220),
        })),
        threads: threads.map((thread) => ({
          id: thread.id,
          senderName: thread.sender_name,
          senderRole: thread.sender_role,
          body: thread.body,
          createdAt: thread.created_at,
        })),
      },
      meta: {
        userId: targetUserId,
        mentorView: targetUserId !== req.user.id,
      },
    });
  } catch (error) {
    next(error);
  }
};
