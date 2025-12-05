import type {
  GridFormInterface,
  SectionFormInterface,
  CriterionFormInterface,
  LevelFormInterface,
  EvaluationFormInterface,
  DepartmentFormInterface,
  SessionFormInterface,
  CourseFormInterface
} from '@/shared/interfaces/index.ts';

import data from '@/data/default.json';
import { v4 as uuid } from 'uuid';

export const generateNewGrid = (courseId: string, isUserGrid: boolean): GridFormInterface => {
  const grid: GridFormInterface = { ...data.defaultGrid };
  console.log(data.defaultGrid);
  grid._id = uuid();
  grid.isNew = true;
  grid.isUserGrid = isUserGrid;
  grid.course = courseId;
  grid.sections = []; //FIXME This patch fix the anormal addition of section in data.defaultGrid
  grid.sections?.push(generateNewSection());

  return grid;
};

export const generateNewSection = (): SectionFormInterface => {
  const section: SectionFormInterface = { ...data.defaultSection };
  section._id = uuid();
  section.criteria = [];
  section.criteria?.push(generateNewCriterion());
  return section;
};

export const generateNewCriterion = (): CriterionFormInterface => {
  const criterion: CriterionFormInterface = { ...data.defaultCriterion };
  criterion._id = uuid();
  criterion.levels?.forEach((level) => (level._id = uuid()));
  return criterion;
};

export const generateNewLevel = (): LevelFormInterface => {
  const level: LevelFormInterface = { ...data.defaultLevel };
  level._id = uuid();
  return level;
};

export const generateEvaluation = (classroomId: string): EvaluationFormInterface => {
  const evaluation: EvaluationFormInterface = {
    _id: uuid(),
    isNew: true,
    classroom: classroomId,
    grid: null as string,
    state: 'created'
  };
  return evaluation;
};

export const generateNewDepartment = (): DepartmentFormInterface => {
  const department: DepartmentFormInterface = {
    _id: uuid(),
    isNew: true
  };
  return department;
};

export const generateNewSession = (): SessionFormInterface => {
  const department: SessionFormInterface = {
    _id: uuid(),
    isNew: true
  };
  return department;
};
export const generateNewCourse = (departmentId: string): CourseFormInterface => {
  const course: CourseFormInterface = {
    _id: uuid(),
    isNew: true,
    department: departmentId
  };
  return course;
};
