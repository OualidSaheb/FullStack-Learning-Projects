import { Group } from "../database/models/index.js";
import { getPopulatedClassroomQuery, getAllClassroomsForSessionQuery, getClassroomsByDepartmentForSessionQuery,
  getClassroomsByUserForSessionQuery, createClassroomQuery, updateClassroomQuery, deleteClassroomQuery,
} from "../database/queries/classrooms.queries.js";
import { i18n } from "../middlewares/i18n.middleware.js";
import { getSystemParametersQuery } from "../database/queries/systems.queries.js";

export const getAUClassrooms = async (req, res, next) => {
  try {
    if (!req.user) { throw new Error(i18n.__("USER_NOT_LOGGED_IN")) }

    let classrooms;

    //const sessionId = req.body.sessionId ? req.body.sessionId : (await getSystemParametersQuery()).currentSession;
    const sessionId = req.params.sessionId ? req.params.sessionId : (await getSystemParametersQuery()).currentSession;

    if (req.user.isAdmin) {
      classrooms = await getAllClassroomsForSessionQuery({ user: req.user, sessionId });
    } else if (req.user.isCoordinator) {
      classrooms = await getClassroomsByDepartmentForSessionQuery({ user: req.user, sessionId});
    } else {
      classrooms = await getClassroomsByUserForSessionQuery({ user: req.user, sessionId });
    }

    res.status(200).json({ result: classrooms });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

export const getPopulatedClassroom = async (req, res, next) => {
  try {
    const classroom = await getPopulatedClassroomQuery(req.params.classroomId);
    res.status(200).json({ result: classroom });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

export const createClassroom = async (req, res, next) => {
  try {
    const group = await Group.findById(req.body.group);
    if (!group) throw new Error(i18n.__("GROUP_NOT_FOUND", { groupId: req.body.group }));

    req.body.students = group.students;
    req.body.organisation = req.user.organisation;
    const classroom = await createClassroomQuery(req.body);
    res.status(200).json({ result: classroom });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

export const updateClassroom = async (req, res, next) => {
  try {
    const classroom = await updateClassroomQuery(req.body);
    res.status(200).json({ result: classroom });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

export const deleteClassroom = async (req, res, next) => {
  try {
    const classroom = await deleteClassroomQuery(req.params.classroomId);
    res.status(200).json({ result: classroom });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};
