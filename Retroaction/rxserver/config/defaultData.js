import { i18n } from "../middlewares/i18n.middleware.js";

// TODO: use i18n for the default values.

export const getDefaultLevel = (title = "Nouveau niveau") => {
  return {
    title: title,
    value: -1,
  };
};

export const getDefaultCriterion = (title = "Nouveau critère d'évaluations") => {
  return {
    title: title,
    levels: [
      {
        title: "Parfait",
        value: 10,
      },
      {
        title: "Très bien",
        value: 8,
      },
      {
        title: "Bien",
        value: 6,
      },
      {
        title: "Quelques lacunes",
        value: 4,
      },
      {
        title: "Beaucoup de lacunes",
        value: 2,
      },
      {
        title: "Ne fonctionne pas",
        value: 0,
      },
    ],
    weight: 10,
  };
};

export const getDefaultSection = (title = "Nouvelle section") => {
  return {
    title: title,
    criteria: [getDefaultCriterion()],
  };
};

export const getDefaultGrid = (courseId, title = "Nouvelle grille") => {
  return {
    title: title,
    sections: [getDefaultSection("Section par défaut")],
    course: courseId,
  };
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

export const getDefaultCourse = (department) => {
  if (!department) 
    throw new Error("Le cours doit avoir un département");

  return {
    code: "000",
    title: "Nouveau Cours",
    department: department,
  };
};

export const getDefaultGroup = (students = [], title = "Nouveau Group", code = "00000") => {
  return {
    code: code,
    title: title,
    students: students,
  };
};

export const getDefaultSession = (title = "Nouvelle session") => {
  return {
    code: "X00",
    title: title,
  };
};

export const getDefaultDepartment = (title = "Nouveau département") => {
  return {
    code: "000",
    title: title,
  };
};

