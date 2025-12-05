import { Grid, Section, Criterion, Level, UserGrid } from "../models/grid.model.js";
import Course from "../models/course.model.js";
import { Evaluation } from "../models/evaluation.model.js";
import { getClassroomCourseQuery } from "./classrooms.queries.js";
import { i18n } from "../../middlewares/i18n.middleware.js";
import * as defaultData from "../../config/defaultData.js";

export const createGridQuery = async (data) => {
  return Grid.create(data);
};

export const createUserGridQuery = async (data) => {
  return UserGrid.create( {...data.grid, teacher: data.teacherId });
};

export const getDefaultUserGrid = (courseId, teacherId, title = "Nouvelle grille") => {
  return {
    title: title,
    sections: [getDefaultSection("Section par défaut")],
    course: courseId,
    teacher: teacherId,
    source: null,
  };
};

export const updateGridQuery = (gridId, data) => {
  return Grid.findByIdAndUpdate(gridId, { $set: data }, { upsert: false, new: true });
};

export const deleteGridQuery = async (id) => {
  const usedGrid = await Evaluation.findOne({grid: id});
  if (!usedGrid){
    return Grid.findByIdAndDelete(id);
  } else {
    throw new Error(i18n.__("GRID_CANNOT_DELETE") + " "+ usedGrid.code);
  }
};

export const getCourseGridsQuery = (courseId) => {
  return Grid.find({ course: courseId });
};


//TODO With aggregate further
export const getClassroomGridsQuery = async (classroomId) => {
  const courseId = await getClassroomCourseQuery(classroomId);
  return this.getCourseGridsQuery(courseId); 
};

export const getGridQuery = (id) => {
  return Grid.findById(id);
};

//* Être en mesure de faire une DeepCopy d'une grille existante */
//https://stackoverflow.com/a/68042460/569989
export const generateUserGridQuery = async ({ gridId, teacherId }) => {

  const grid = await Grid.findById(gridId);

  let clone = JSON.parse(JSON.stringify(grid));
  delete clone._id;
  delete clone.code;
  clone.title = clone.title + " - " + "COPIE"; // TODO: use i18n for "COPIE"
  for (let section of clone.sections) {
    delete section._id;
    for (let criterion of section.criteria) {
      delete criterion._id;
      for (let level of criterion.levels) {
        delete level._id;
      }
    }
  }

  const userGrid = await UserGrid.create({
    teacher: teacherId,
    source: gridId,
    ...clone,
  });
  return userGrid;
}; 


//** OLD CODE HERE */

export const getGridsQuery = (_) => {
  return Grid.find({}).populate("course");
};

export const createSectionQuery = async (gridId) => {
  return Grid.findByIdAndRemove(gridId);
};

export const createDefaultGridQuery = (courseId, name, code) => {
  const grid = new Grid(defaultData.getDefaultGrid(courseId, name));
  if(code) grid.code = code;
  return grid.save();
};

export const getGridEvaluationsQuery = (gridId) => {
  return Evaluation.find({ grid: gridId });
};