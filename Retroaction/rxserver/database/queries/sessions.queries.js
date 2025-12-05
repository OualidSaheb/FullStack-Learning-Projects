import { Session } from "../models/index.js";
import { getDefaultSession } from "../../config/defaultData.js";

export const getSessionsQuery = () => {
  return Session.find({});
};

export const getSessionsByOrganisationQuery = (organisation) => {
  return Session.find({ organisation: organisation });
};

export const createSessionQuery = async (newSession) => {
  return Session.create(newSession);
};

export const deleteAllSessionsQuery = () => {
  return Session.deleteMany({});
};

export const updateSessionQuery = (session) => {
  return Session.findByIdAndUpdate(session._id, session, { new: true });
};

export const deleteSessionQuery = async (sessionId) => {
  return Session.findByIdAndDelete(sessionId);
};
