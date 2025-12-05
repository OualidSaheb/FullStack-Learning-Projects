import {
  Organisation,
  Department,
  Course,
  Classroom,
  Group,
  Session,
  Grid,
  Evaluation,
  Teacher,
  Student
} from "./models/index.js";


export const getData =  async (req, res) => {

  const organisation = await Organisation.find();
  const departments = await Department.find();
  const courses = await Course.find();
  const classrooms = await Classroom.find();
  const groups = await Group.find();
  const sessions = await Session.find();
  const grids = await Grid.find();
  const evaluations = await Evaluation.find();
  const teachers = await Teacher.find();
  const students = await Student.find();

  res.json({
    result: {
      organisation,
      departments,
      groups,
      grids,
      courses,
      sessions,
      classrooms,
      evaluations,
      teachers,
      students,
    },
  });
};