import type modulesData from "@/data/academyModules.json";

export type ModuleQuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: string;
};

export type ModuleQuiz = {
  id: string;
  title: string;
  description?: string;
  questions: ModuleQuizQuestion[];
};

type JsonModule = (typeof modulesData)[number];

export type StaticAcademyModule = JsonModule & {
  quiz?: ModuleQuiz;
};
