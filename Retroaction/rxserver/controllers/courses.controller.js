import { Classroom} from "../database/models/index.js";

import {
  getAllCoursesQuery,
  getPopulatedCourseQuery,
  getCoursesByDepartmentQuery,
  getCoursesByOrganisationQuery,
  createCourseQuery,
  updateCourseQuery,
  deleteCourseQuery,
} from "../database/queries/course.queries.js";
import { i18n } from "../middlewares/i18n.middleware.js";

// FIXME: readCourses is not defined
export const getAllCourses = async (req, res, next) => {
  try {
    const courses = await readCourses();
    res.status(200).json({ result: courses });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};


//TODO: Need to get specific request for Evaluation page course request.  Not this one
export const getAUCourses = async (req, res, next) => {
  try {
    let courses;

    if (!req.user) throw new Error(i18n.__("USER_NOT_LOGGED_IN"));

    if (req.user.isAdmin) {
      courses = await getCoursesByOrganisationQuery(req.user.organisation);
    } else {
      const department = req.user.department;
      courses = await getCoursesByDepartmentQuery(department);
    }

    res.status(200).json({ result: courses });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

export const getDepartmentsCourse = async (req, res, next) => {
  try {
    const courses = await getCoursesByDepartmentQuery(req.params.departmentId);
    res.status(200).json({ result: courses });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

// FIXME: readCourses is not defined
export const getCourses = async (req, res, next) => {
  try {
    const courses = await readCourses();
    res.status(200).json({ result: courses });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

// FIXME: getCoursesList is not defined or is a circular reference
export const getCoursesList = async (req, res, next) => {
  try {
    const courses = await getCoursesList(req.user._id);

    res.status(200).json({ result: courses });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

// FIXME: getCoursesByUser is not defined or is a circular reference
export const getCoursesByUser = async (req, res, next) => {
  try {
    const courses = await getCoursesByUser(req.user);
    res.status(200).json({ result: courses });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

export const getPopulatedCourse = async (req, res) => {
  try {
    const course = await getPopulatedCourseQuery(req.params.courseId);
    res.status(200).json({ result: course });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const newCourse = await createCourseQuery(req.body);
    res.status(200).json({ result: newCourse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const course = await updateCourseQuery(req.params.courseId, req.body);
    res.status(200).json({ result: course });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const Classrooms = await Classroom.find({ course: req.params.courseId });

    if (Classrooms.length) {
      throw new Error(
        i18n.__("COURSE_CANNOT_DELETE")
      );
    } 

    const course = await deleteCourseQuery(req.params.courseId);

    res.status(200).json({ result: course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

