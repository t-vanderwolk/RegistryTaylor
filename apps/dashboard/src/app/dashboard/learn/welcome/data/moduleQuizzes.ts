import type { ModuleQuiz, StaticAcademyModule } from "./types";

export const moduleQuizzes: Record<string, ModuleQuiz> = {
  "nursery-vision-foundations": {
    id: "quiz-nursery-vision-foundations",
    title: "Nursery Vision Knowledge Check",
    description: "Ensure every design choice maps back to calm, sensory-aware intentions.",
    questions: [
      {
        id: "nursery-vision-foundations-q1",
        question: "What should you define before picking paint colors or decor?",
        options: [
          "A sensory goal and emotional intent for the space",
          "The exact number of storage bins",
          "Which influencer nursery to copy",
        ],
        answer: "A sensory goal and emotional intent for the space",
      },
      {
        id: "nursery-vision-foundations-q2",
        question: "Which lighting temperature best supports late-night feeds?",
        options: ["Cool 5000K daylight bulbs", "Warm 2700K amber bulbs", "Color-changing party lights"],
        answer: "Warm 2700K amber bulbs",
      },
      {
        id: "nursery-vision-foundations-q3",
        question: "How do you future-proof nursery furniture?",
        options: [
          "Buy only miniature pieces",
          "Select modular items that convert as baby grows",
          "Avoid anything with storage",
        ],
        answer: "Select modular items that convert as baby grows",
      },
    ],
  },
  "gear-stroller-masterclass": {
    id: "quiz-gear-stroller-masterclass",
    title: "Stroller Lifestyle Fit Quiz",
    description: "Match mobility gear to terrain, fold style, and family rhythm.",
    questions: [
      {
        id: "gear-stroller-masterclass-q1",
        question: "Which detail most affects how quickly a stroller folds in city life?",
        options: ["Wheel spoke design", "One-hand fold mechanism", "Seat fabric color"],
        answer: "One-hand fold mechanism",
      },
      {
        id: "gear-stroller-masterclass-q2",
        question: "Why map your most common terrain?",
        options: [
          "It determines wheel material and suspension needs",
          "It decides which diaper bag to buy",
          "It helps you pick nursery wallpaper",
        ],
        answer: "It determines wheel material and suspension needs",
      },
      {
        id: "gear-stroller-masterclass-q3",
        question: "What ensures stroller + car-seat compatibility?",
        options: [
          "Matching brand hashtags",
          "Confirming adapter or travel system support",
          "Buying the most expensive option",
        ],
        answer: "Confirming adapter or travel system support",
      },
    ],
  },
  "gear-car-seat-masterclass": {
    id: "quiz-gear-car-seat-masterclass",
    title: "Car-Seat Confidence Quiz",
    questions: [
      {
        id: "gear-car-seat-masterclass-q1",
        question: "What indicates a correct infant seat recline for newborns?",
        options: ["Level indicator in the safe zone", "Harness straps at eye level", "Handle locked forward"],
        answer: "Level indicator in the safe zone",
      },
      {
        id: "gear-car-seat-masterclass-q2",
        question: "How often should you check for car-seat recalls?",
        options: ["Only when the seat looks worn", "At purchase and during annual safety weeks", "Never, brands notify you automatically"],
        answer: "At purchase and during annual safety weeks",
      },
      {
        id: "gear-car-seat-masterclass-q3",
        question: "What’s the best way to verify a tight install?",
        options: ["Seat moves less than one inch at the belt path", "The canopy opens smoothly", "The seat fabric feels taut"],
        answer: "Seat moves less than one inch at the belt path",
      },
    ],
  },
  "postpartum-rest-recovery": {
    id: "quiz-postpartum-rest-recovery",
    title: "Rest & Recovery Ritual Quiz",
    description: "Ground your healing plan in nervous-system aware habits.",
    questions: [
      {
        id: "postpartum-rest-recovery-q1",
        question: "What defines a realistic postpartum rest plan?",
        options: [
          "Scheduling every visitor immediately",
          "Intentionally layering hydration, nourishment, and help",
          "Waiting to ask for support until you feel overwhelmed",
        ],
        answer: "Intentionally layering hydration, nourishment, and help",
      },
      {
        id: "postpartum-rest-recovery-q2",
        question: "Which tool helps track how your body feels week to week?",
        options: ["Realistic Pre-Baby Body Map exercise", "Color-coded nursery bins", "Daily stroller mileage"],
        answer: "Realistic Pre-Baby Body Map exercise",
      },
      {
        id: "postpartum-rest-recovery-q3",
        question: "Why is slowing down emphasized in this module?",
        options: [
          "Healing accelerates when you compete with others",
          "Rest protects hormones, tissue repair, and emotional stability",
          "It keeps you from ever leaving the bedroom",
        ],
        answer: "Rest protects hormones, tissue repair, and emotional stability",
      },
    ],
  },
  "postpartum-self-care": {
    id: "quiz-postpartum-self-care",
    title: "Micro-Rituals Check-In",
    questions: [
      {
        id: "postpartum-self-care-q1",
        question: "What is the purpose of habit stacking in postpartum life?",
        options: [
          "To add as many new tasks as possible",
          "To pair wellness rituals with existing routines",
          "To keep score of productivity",
        ],
        answer: "To pair wellness rituals with existing routines",
      },
      {
        id: "postpartum-self-care-q2",
        question: "Which statement best reflects the module’s definition of self-care?",
        options: [
          "It’s a reward for finishing chores",
          "It’s maintenance that preserves energy and calm",
          "It’s optional if you feel motivated",
        ],
        answer: "It’s maintenance that preserves energy and calm",
      },
      {
        id: "postpartum-self-care-q3",
        question: "Why involve a partner or support person in micro-rituals?",
        options: [
          "Shared care transforms rituals into consistent support",
          "It allows you to avoid planning ahead",
          "They can grade how well you perform habits",
        ],
        answer: "Shared care transforms rituals into consistent support",
      },
    ],
  },
};

export function withModuleQuizzes(modules: StaticAcademyModule[]): StaticAcademyModule[] {
  return modules.map((module) => {
    const quiz = moduleQuizzes[module.slug];
    if (!quiz) {
      return module;
    }
    return { ...module, quiz };
  });
}
