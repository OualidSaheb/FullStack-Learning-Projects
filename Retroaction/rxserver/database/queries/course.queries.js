import { Course } from "../models/index.js";
import { getDefaultCourse } from "../../config/defaultData.js";

export const getAllCoursesQuery = () => {
  return Course.find({});
};

export const getPopulatedCourseQuery = (id) => {
  return Course.findById(id).populate("department");
};

export const getCoursesByDepartmentQuery = async (department) => {
  return Course.find({ department: department });
};

export const getCoursesByOrganisationQuery = async (organisation) => {
  return Course.find().populate('department').then((courses) => {
    return courses.filter((course) => course.department.organisation === organisation);
  }
  );
};

export const createCourseQuery = async (course) => {
  return Course.create(course);
};

export const updateCourseQuery = (courseId, data) => {
  return Course.findByIdAndUpdate(courseId, { $set: data }, { new: true });
};

export const deleteCourseQuery = (courseId) => {
  return Course.findByIdAndDelete(courseId);
};
