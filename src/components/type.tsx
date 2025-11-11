export interface Task {
  _id: string;
  title: string;
  deadline: string;
  description: string;
  project: string;
  status: "Tasks" | "In Progress" | "In Review" | "Done";
}
