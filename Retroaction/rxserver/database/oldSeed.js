const HTTP_PORT = 4040;

import {
  User,
  Teacher,
  Organisation,
  Department,
  Student,
  Course,
  Classroom,
  Group,
  Session,
  Grid,
  Evaluation,
} from "../database/models";

import { sessionCreate } from "../database/queries/auth.queries";

import { createGrid, generateUserGrid } from "../database/queries/grids.queries";

import mongoose from "mongoose";
import express from "express";
const app = express();
import db from "./index";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.connect(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`Serveur NodeJS démarré sur http://localhost:${HTTP_PORT}`);
  });
});

app.post("/seed", async (req, res) => {
  await mongoose.connection.db.dropDatabase();

  const session1 = await Session.create({
    code: "H23",
    name: "Hiver 2023",
  });

  const session2 = await Session.create({
    code: "E23",
    name: "Été 2023",
  });

  const organisation = await Organisation.create({ name: "Cégep de Shawinigan", code: "923030" });

  const department1 = await Department.create({
    organisation,
    name: "Informatique",
    code: "420",
  });

  const department2 = await Department.create({
    organisation,
    name: "Développement Logiciel",
    code: "LEA.BY",
  });

  const department3 = await Department.create({
    organisation,
    name: "Mathématiques",
    code: "MAT.BY",
  });

  const hashedPassword = await User.hashPassword("pass123");

  const invite = await Teacher.create({
    code: "1000",
    firstName: "Antoine",
    lastName: "Deschesnes",
    isCoordinator: true,
    local: {
      email: "anthoine@gmail.com",
      password: hashedPassword,
    },
    departments: [department2],
  });

  const teacher = await Teacher.create({
    code: "1001",
    firstName: "The",
    lastName: "Teacher",
    isCoordinator: false,
    local: {
      email: "teacher@gmail.com",
      password: hashedPassword,
    },
    departments: [department2],
  });

  const coordinator = await Teacher.create({
    code: "1002",
    firstName: "The",
    lastName: "Coordinator",
    isCoordinator: true,
    local: {
      email: "coordinator@gmail.com",
      password: hashedPassword,
    },
    departments: [department1, department2],
  });

  const admin = await User.create({
    code: "1003",
    firstName: "The",
    lastName: "Admin",
    isAdmin: true,
    local: {
      email: "admin@gmail.com",
      password: hashedPassword,
    },
  });

  const student1 = await Student.create({
    code: "1003",
    firstName: "The",
    lastName: "Student1",
    local: {
      email: "student1@gmail.com",
      password: hashedPassword,
    },
    departments: [department2],
  });

  const student2 = await Student.create({
    code: "1004",
    firstName: "The",
    lastName: "Student2",
    local: {
      email: "student2@gmail.com",
      password: hashedPassword,
    },
    departments: [department2],
  });

  const student3 = await Student.create({
    code: "1005",
    firstName: "The",
    lastName: "Student3",
    local: {
      email: "student3@gmail.com",
      password: hashedPassword,
    },
    departments: [department2],
  });

  const course1 = await Course.create({
    title: "Développement d'application web transactionnelles",
    code: "1B4",
    department: department2,
  });

  const course2 = await Course.create({
    title: "Développement d'application web transactionnelles avancées",
    code: "2B4",
    department: department2,
  });

  const course3 = await Course.create({
    title: "Serveur Web I",
    code: "2SU",
    department: department1,
  });

  const course4 = await Course.create({
    title: "Calcul différentiel",
    code: "MTH",
    department: department3,
  });

  const grid1 = await createGrid(course1._id, "MGL01 - Création de la maquette visuelle de l'application");
  const grid2 = await createGrid(course2._id, "Atlas 5 - Remise finale");
  const grid3 = await createGrid(course3._id, "Canadian Tire - Remise finale");

  const userGrid1 = generateUserGrid({ sessionId: session1._id, gridId: grid1._id, teacherId: teacher._id });
  const userGrid2 = generateUserGrid({ sessionId: session2._id, gridId: grid2._id, teacherId: teacher._id });

  const group = await Group.create({
    code: "20200",
    students: [student1, student2, student3],
  });

  const class1 = await Classroom.create({
    code: "__new",
    session: session1,
    course: course1,
    groupCode: group.code,
    students: [student1, student2, student3],
    teachers: [teacher, coordinator],
  });

  const class2 = await Classroom.create({
    code: "__new",
    session: session2,
    course: course2,
    groupCode: group.code,
    students: [student1, student2, student3],
    teachers: [teacher, coordinator],
  });

  const evaluation = await Evaluation.create({
    code: "__new",
    class: class1,
    grid: grid1,
  });

  const adminAuth = await sessionCreate({ email: "admin@gmail.com", password: "pass123" });
  const coordinatorAuth = await sessionCreate({ email: "coordinator@gmail.com", password: "pass123" });
  const teacherAuth = await sessionCreate({ email: "teacher@gmail.com", password: "pass123" });

  res.json({
    result: {
      organisation,
      department1,
      department2,
      department3,
      teacher,
      coordinator,
      admin,
      invite,
      group,
      student1,
      student2,
      student3,
      grid1,
      grid2,
      grid3,
      userGrid1,
      userGrid2,
      course1,
      course2,
      course3,
      course4,
      session1,
      session2,
      class1,
      class2,
      evaluation,
      adminToken: adminAuth.token,
      coordinatorToken: coordinatorAuth.token,
      teacherToken: teacherAuth.token,
    },
  });
});
