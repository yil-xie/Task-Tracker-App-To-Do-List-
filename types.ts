export type Category = string;

export type Priority = "doNow" | "doNextWeek" | "doLater";

export type Task = {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  completed: boolean;
  date: string;
};
