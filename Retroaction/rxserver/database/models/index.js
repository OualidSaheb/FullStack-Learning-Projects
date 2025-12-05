import System from "./system.model.js";

import Organisation from "./organisation.model.js";
import Department from "./department.model.js";

import Classroom from "./classroom.model.js";
import Course from "./course.model.js";

/* Route all schema model from Evaluation  */
import { Evaluation } from "./evaluation.model.js" ;
import { Correction } from "./evaluation.model.js";
import { Result } from "./evaluation.model.js" ;

/* Route all schema model from Grid  */
import { Grid } from "./grid.model.js";
import { Section } from "./grid.model.js";
import { Criterion } from "./grid.model.js";
import { Level } from "./grid.model.js";
import { UserGrid } from "./grid.model.js";

import Group from "./group.model.js";
import Session from "./session.model.js";
import Student from "./student.model.js";
import Teacher from "./teacher.model.js";
import User from "./user.model.js";

export { System, Organisation, Department, Classroom, Course, Evaluation, Correction, Result, Grid, Section, Criterion, Level, UserGrid, Group, Session, Student, Teacher, User };