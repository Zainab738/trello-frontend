import * as Yup from "yup";

const TaskValidation = Yup.object({
  title: Yup.string().required("title is required"),
  description: Yup.string().required("description is required"),
  status: Yup.string().required("status is required"),
  deadline: Yup.string().required("deadline is required"),
});
export default TaskValidation;
