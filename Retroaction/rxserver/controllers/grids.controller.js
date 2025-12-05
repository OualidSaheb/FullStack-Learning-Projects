import {
  getGridsQuery,
  getGridQuery,
  /*updateGridsQuery,*/
  updateGridQuery,
  createGridQuery,
  createUserGridQuery,
  deleteGridQuery,
  /*getGridByCodeQuery,*/
  getCourseGridsQuery,
  generateUserGridQuery,
  getClassroomGridsQuery
} from"../database/queries/grids.queries.js";
import { getDefaultSection, getDefaultCriterion, getDefaultLevel } from "../config/defaultData.js";

import { Level, Section, Grid, Criterion } from "../database/models/index.js";

import { i18n } from "../middlewares/i18n.middleware.js";
import { gridSchema } from "../database/models/grid.model.js";


export const createGrid = async (req, res, next) => {
  try {
    const grid = await createGridQuery(req.body);
    res.status(200).json({ result: grid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createUserGrid = async (req, res, next) => {
  try {
    const grid = await createUserGridQuery( { grid: req.body.grid, teacherId: req.user._id });
    res.status(200).json({ result: grid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateGrid = async (req, res, next) => {
  try {
    const grid = await updateGridQuery(req.params.gridId, req.body);
    res.status(200).json({ result: grid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteGrid = async (req, res, next) => {
  try {
    const grid = await deleteGridQuery(req.params.gridId);
    res.status(200).json({ result: grid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGrid = async (req, res, next) => {
  try {
    const grid = await getGridQuery(req.params.gridId);
    res.status(200).json({ result: grid});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCourseGrids = async (req, res, next) => {
  try {
    const grids = await getCourseGridsQuery(req.params.courseId);
    res.status(200).json({ result: grids });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getClassroomGrids = async (req, res, next) => {
  try {
    const grids = await getClassroomGridsQuery(req.params.classroomId);
    res.status(200).json({ result: grids });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const generateUserGrid = async (req, res, next) => {
  try {
    const gridId = req.params.gridId;
    const teacherId = req.user._id;

    const grid = await generateUserGridQuery({ gridId, teacherId });
    res.status(200).json({ result: grid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//** SECTIONS */

//** OLD CODE HERE */

export const getGrids = async (req, res, next) => {
  try {
    const grids = await getGridsQuery();
    res.status(200).json({ result: grids });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGridByCode = async (req, res, next) => {
  try {
    const grid = await getGridByCodeQuery(req.params.code);
    res.status(200).json({ result: grid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateGrids = async (req, res, next) => {
  try {
    const grids = await updateGridsQuery(req.body);
    res.status(200).json({ result: grids });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createSection = async (req, res, next) => {
  try {
    const grid = await getGridQuery(req.params.gridId);
    if (!grid) throw new Error(i18n.__("GRID_NOT_FOUND"));
    const section = await Section.create(getDefaultSection());
    grid.sections.push(section);
    await grid.save();
    res.status(200).json({ result: section });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSection = async (req, res, next) => {
  try {
    const grid = await getGridQuery(req.params.gridId);
    const section = grid.sections.find((section) => section._id.toString() === req.params.sectionId);
    res.status(200).json({ result: section });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSection = async (req, res, next) => {
  try {
    const grid = await Grid.findOne({ "sections._id": req.params.sectionId });
    if (!grid) throw new Error(i18n.__("GRID_NOT_FOUND"));
    const section = grid.sections.find((section) => section._id.toString() === req.params.sectionId);
    if (req.body.title) section.title = req.body.title;
    await grid.save();
    res.status(200).json({ result: grid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSection = async (req, res, next) => {
  try {
    const grid = await Grid.findOne({ "sections._id": req.params.sectionId });
    if (!grid) throw new Error(i18n.__("GRID_NOT_FOUND"));

    const section = grid.sections.find((section) => section._id.toString() === req.params.sectionId);
    if (!section) throw new Error(i18n.__("GRID_SECTION_NOT_FOUND"));

    grid.sections = grid.sections.filter((section) => section._id.toString() !== req.params.sectionId);
    await grid.save();
    res.status(200).json({ result: grid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCriterion = async (req, res, next) => {
  try {
    const grid = await Grid.findOne({ "sections._id": req.params.sectionId });
    if (!grid) throw new Error(i18n.__("GRID_NOT_FOUND"));
    const section = grid.sections.find((section) => section._id.toString() === req.params.sectionId);
    section.criteria[section.criteria.push(getDefaultCriterion()) - 1];
    await grid.save();
    res.status(200).json({ result: grid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCriterion = async (req, res, next) => {
  try {
    const grid = await Grid.findOne({ "sections.criteria._id": req.params.criterionId });
    if (!grid) throw new Error(i18n.__("GRID_NOT_FOUND"));

    // grid.sections.forEach( section => {
    //   section.criteria.forEach(criterion => {
    //     if( req.params.criterionId === criterion._id.toString() ) {
    //       if()
    //     }
    //   }
    // })

    await grid.save();
    res.status(200).json({ result: grid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//** RENDU ICITTE */

export const deleteCriterion = async (req, res, next) => {
  try {
    const grid = await getGridQuery(req.params.gridId);
    const section = grid.sections.find((section) => section._id.toString() === req.params.sectionId);
    //section.criteria.find((criterion) => criterion._id.toString() === req.params.criterionId);
    section.criteria = section.criteria.filter((criterion) => criterion._id.toString() !== req.params.criterionId);
    await grid.save();
    res.status(200).json({ result: grid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createLevel = async (req, res, next) => {
  try {
    const grid = await getGridQuery(req.params.gridId);
    const section = grid.sections.find((section) => section._id.toString() === req.params.sectionId);
    const criterion = section.criteria.find((criterion) => criterion._id.toString() === req.params.criterionId);
    const level = criterion.levels[criterion.levels.push(getDefaultLevel()) - 1];
    await grid.save();
    res.status(200).json({ result: grid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const updateLevel = async (req, res, next) => {
  try {
    const grid = await getGridQuery(req.params.gridId);
    const section = grid.sections.find((section) => section._id.toString() === req.params.sectionId);
    const criterion = section.criteria.find((criterion) => criterion._id.toString() === req.params.ccriterionId);
    const level = criterion.levels.find((level) => level._id.toString() === req.params.levelId);
    level.title = req.body.title;
    level.value = req.body.value;
    await grid.save();
    res.status(200).json({ result: grid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteLevel = async (req, res, next) => {
  try {
    const grid = await getGridQuery(req.params.gridId);
    const section = grid.sections.find((section) => section._id.toString() === req.params.sectionId);
    const criterion = section.criteria.find((criterion) => criterion._id.toString() === req.params.criterionId);
    criterion.levels.find((level) => level._id.toString() === req.params.levelId);
    criterion.levels = criterion.levels.filter((level) => level._id.toString() !== req.params.levelId);
    await grid.save();
    res.status(200).json({ result: grid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//** GRID SECTION */
//use for departemnts grids
export const createDefaultGrid = async (req, res, next) => {
  try {
    const grid = await createDefaultGridQuery(req.body.courseId);
    res.status(200).json({ result: grid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//use for session grids
export const createDefaultUserGrid = async (req, res, next) => {
  try {
    const departmentId = req.user.department;
    const courseId = req.body.courseId;
    const teacherId = req.user._id.toString();

    const grid = await createDefaultUserGridQuery( {departmentId, courseId, teacherId });
    res.status(200).json({ result: grid });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};