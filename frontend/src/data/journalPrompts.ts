export type JournalPrompt = {
  id: number;
  category: "humor" | "emotion" | "reflection" | "memory";
  text: string;
};

export const journalPrompts: JournalPrompt[] = [
  // Humor ✨
  {
    id: 1,
    category: "humor",
    text: "If your baby wrote a Yelp review of today, what would it say? ⭐️",
  },
  {
    id: 2,
    category: "humor",
    text: "Describe your parenting day using only emojis. Go ahead, be dramatic.",
  },
  {
    id: 3,
    category: "humor",
    text: "What’s one ridiculous thing you’ve Googled at 3 a.m. this week?",
  },
  {
    id: 4,
    category: "humor",
    text: "If coffee could talk, what would it say to you right now?",
  },
  {
    id: 5,
    category: "humor",
    text: "Name something your baby did today that deserves an Oscar.",
  },

  // Emotion ❤️
  {
    id: 6,
    category: "emotion",
    text: "What moment today made you feel the most love?",
  },
  {
    id: 7,
    category: "emotion",
    text: "Write a note to your future, well-rested self.",
  },
  {
    id: 8,
    category: "emotion",
    text: "When was the last time you felt really proud of yourself as a parent?",
  },
  {
    id: 9,
    category: "emotion",
    text: "What emotion keeps showing up for you this week — and what might it be trying to tell you?",
  },
  {
    id: 10,
    category: "emotion",
    text: "What’s something small that made today easier?",
  },

  // Reflection 🌙
  {
    id: 11,
    category: "reflection",
    text: "What’s a parenting ‘rule’ you’ve joyfully broken — and why?",
  },
  {
    id: 12,
    category: "reflection",
    text: "Describe a tiny win that felt huge this week.",
  },
  {
    id: 13,
    category: "reflection",
    text: "What’s one thing you wish someone had told you before baby arrived?",
  },
  {
    id: 14,
    category: "reflection",
    text: "If you could freeze one moment from today, what would it be?",
  },
  {
    id: 15,
    category: "reflection",
    text: "What’s something you’re learning to let go of?",
  },

  // Memory 📸
  {
    id: 16,
    category: "memory",
    text: "What new milestone or funny habit is your baby working on?",
  },
  {
    id: 17,
    category: "memory",
    text: "Describe the last photo you took of your baby — why did you love that moment?",
  },
  {
    id: 18,
    category: "memory",
    text: "Who or what helped you feel supported this week?",
  },
  {
    id: 19,
    category: "memory",
    text: "What’s a song, smell, or sound that instantly brings you back to early parenthood?",
  },
  {
    id: 20,
    category: "memory",
    text: "Write one thing your future child might find hilarious about your parenting era.",
  },
];

export function getRandomJournalPrompt(): JournalPrompt {
  return journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
}
