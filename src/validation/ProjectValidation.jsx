import * as Yup from "yup";

const ProjectValidation = Yup.object({
  title: Yup.string().required("title is required").min(3),
  content: Yup.string().required("content is required"),
});
export default ProjectValidation;
