import {
  createGroupQuery,
  getPopulatedGroupQuery,
  getGroupsQuery,
  deleteGroupQuery,
  updateGroupQuery,
  getGroupsByOrganisationQuery,
  /*addStudentToGroupQuery,*/
  /*addStudentsQuery,*/
} from "../database/queries/groups.queries.js";
import { findUserByIDQuery } from "../database/queries/users.queries.js";

export const createGroup = async (req, res, next) => {
  try {
    req.body.organisation = req.user.organisation;
    const group = await createGroupQuery(req.body);
    res.status(200).json({ result: group });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllGroups = async (req, res, next) => {
  try {
    const groups = await getGroupsQuery();
    res.status(200).json({ result: groups });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGroups = async (req, res, next) => {
  try {
    const groups = await getGroupsByOrganisationQuery(req.user.organisation);
    res.status(200).json({ result: groups });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPopulatedGroup = async (req, res, next) => {
  try {
    const group = await getPopulatedGroupQuery(req.params.groupId);
    res.status(200).json({ result: group });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOneGroup = async (req, res, next) => {
  try {
    const group = await deleteGroupQuery(req.params.groupId);
    res.status(200).json({ result: group });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateGroup = async (req, res, next) => {
  try {
    const group = await updateGroupQuery(req.body);
    res.status(200).json({ result: group });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addStudentToGroup = async (req, res, next) => {
  try {
    const group = await getGroupQuery(req.params.groupsId);
    const user = await findUserByIDQuery(req.params.userId);
    group.students.push(user);
    await updateGroupQuery(group);
    //TODO vérifier si on return le group ou le user!!!
    res.status(200).json({ result: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const deleteStudentFromGroup = async (req, res, next) => {
  try {
    const group = await getGroupQuery(req.params.groupsId);
    const user = await findUserByIDQuery(req.params.userId);

    group.students = group.students.filter((student) => student._id.toString() !== user._id.toString());
    await updateGroupQuery(group);
    res.status(200).json({ result: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// export const getStudentsFromGroup = async (req, res, next) => {
//   try {
//     const group = await getGroupQuery(req.params.groupId);

//     res.json(   );
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error.message });
//   }
// }



