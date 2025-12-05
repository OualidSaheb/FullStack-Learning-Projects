import { Group } from "../models/index.js";
import { getDefaultGroup } from "../../config/defaultData.js";

export const createGroupQuery = async data => {
  return Group.create(data);
};

export const getPopulatedGroupQuery = async (id) => {
  return await Group.findById(id).populate("students");
};

export const getGroupsQuery = async () => {
  return await Group.find({});
};

export const getGroupsByOrganisationQuery = async (organisation) => {
  return await Group.find({ organisation: organisation });
};

export const deleteAllGroupsQuery = async () => {
  return await Group.deleteMany({});
};

export const deleteGroupQuery = async (groupId) => {
  return await Group.findByIdAndRemove(groupId);
};

export const updateGroupQuery = async (group) => {
  return await Group.findByIdAndUpdate(group._id, group, { new: true });
};

export const findOrCreateGroupQuery = async (code, organisation) => {
  let group = await Group.findOne({ code: code });

  if (!group) {
    group = new Group(getDefaultGroup(undefined, undefined, code));
    group.organisation = organisation;

    await group.save();
  }

  return group;
};
