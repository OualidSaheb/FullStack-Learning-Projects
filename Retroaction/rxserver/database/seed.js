const HTTP_PORT = 4040;

import "../environment/index.js";
import fs from "fs";
import { User, Teacher, Organisation, Department, Student, Course, Classroom, Group, Session, Grid, Evaluation, System} from "./models/index.js";
import { createGridQuery } from "../database/queries/grids.queries.js";
import mongoose from "mongoose";
import express from "express";
const app = express();
import * as db from "./index.js";
import { i18nConfig } from "../middlewares/i18n.middleware.js";

const data = JSON.parse(fs.readFileSync("data/seed.json"));

i18nConfig(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.connect(async () => {
  const server = app.listen(HTTP_PORT, () => {
    console.log(`Serveur NodeJS démarré sur http://localhost:${HTTP_PORT}`);
  });

  console.log("Seeding database...");
  seedDatabase(() => {
    server.close(() => {
      console.log("Serveur arrêté");
      process.exit(0);
    });
  });
});

async function seedDatabase(callback) {
  await mongoose.connection.db.dropDatabase();

  console.log("Adding organisations...");
  let organisations = [];
  for (const organisation of data.organisations) {
    organisations.push(await Organisation.create(organisation));
  }


  console.log("Adding sessions...");
  let sessions = [];
  for (const session of data.sessions) {
    sessions.push(await Session.create({
      ...session,
      organisation: await Organisation.findOne({ code: session.organisation }),
    }));
  }

  console.log("Creatin System table...");
  await System.create({
    organisation: organisations[0]._id,
    nextGridCode: 1001,
    nextEvaluationCode: 1001,
    nextClassroomCode: 1001,
    currentSession: sessions[1]._id  });

  console.log("Adding departments...");
  for (const department of data.departments) {
    const organisation = await Organisation.findOne({ code: department.organisation });
    await Department.create({ ...department, organisation: organisation });
  }


  console.log("Adding admins...");
  for (const admin of data.admins) {
    await User.create({ 
      ...admin, 
      organisation: await Organisation.findOne({ code: admin.organisation }),
      local: { 
        ...admin.local, 
        password: await User.hashPassword(admin.local.password) 
      } 
    });
  }

  console.log("Adding teachers...");
  for (const teacher of data.teachers) {

    let assignments = [];
    for(const assignment of teacher.assignments) {
      const department = await Department.findOne({ code: assignment.department });
      assignments.push({ department: department, isCoordinator: assignment.isCoordinator}); 
    }

    /*     const assignments = await Promise.all(
      teacher.assignments.map(async (assignment) => {
        return await Department.findOne({ department: assignment.department });
      })
    ); */
    await Teacher.create({ 
      ...teacher,
      department: assignments[0].department,
      assignments: assignments,
      organisation: await Organisation.findOne({ code: teacher.organisation }), 
      local: {...teacher.local, password: await User.hashPassword(teacher.local.password)} 
    });
  }


  // TODO: students aren't currently associated with departments. The model will need to be updated.
  console.log("Adding students...");
  for (const student of data.students) {
    /*     const departments = await Promise.all(
      student.departments.map(async (code) => {
        return await Department.findOne({ code });
      })
    ); */

    await Student.create({ ...student, local: {...student.local, password: await User.hashPassword(student.local.password)} });
  }

  console.log("Adding groups...");
  for (const group of data.groups) {
    const students = await Promise.all(
      group.students.map(async (code) => {
        return await Student.findOne({ code });
      })
    );

    await Group.create({ 
      ...group, 
      students: students,
      organisation: await Organisation.findOne({ code: group.organisation }), 
    });
  }

  console.log("Adding courses...");
  for (const course of data.courses) {
    const department = await Department.findOne({ code: course.department });

    await Course.create({ ...course, department: department });
  }

  console.log("Adding grids...");
  for (const grid of data.grids) {
    const course = await Course.findOne({ code: grid.course });
    let section = data.sections.find(s => s.title === grid.section);
    if (section) { 
      await Grid.create({ code: grid.code, title: grid.description, course: course, sections: [section] });
    } else {
      //await createGridQuery(course._id, grid.description, grid.code);
    }
  }

  console.log("Adding classrooms...");
  let classrooms = [];
  for (const classroom of data.classrooms) {
    classrooms.push(
      await Classroom.create({
        code: classroom.code,
        session: await Session.findOne({ code: classroom.session }),
        course: await Course.findOne({ code: classroom.course }),
        group: await Group.findOne({ code: classroom.group }),
        students: (await Group.findOne({ code: classroom.group })).students,
        teachers: await Teacher.find({ code: classroom.teachers }),
      })
    );
  }

  console.log("Adding évaluations...");
  let evaluations = [];
  for (const evaluation of data.evaluations) {
    evaluations.push(
      await Evaluation.create({
        classroom: await Classroom.findOne({ code: evaluation.classroom}),
        grid: await Grid.findOne({ code: evaluation.grid }),
      })
    );
  }

  callback();
}
