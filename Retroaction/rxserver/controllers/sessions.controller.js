import { Classroom} from "../database/models/index.js";
import { i18n } from "../middlewares/i18n.middleware.js";
import { createSessionQuery, getSessionsQuery, deleteSessionQuery, updateSessionQuery, getSessionsByOrganisationQuery } from "../database/queries/sessions.queries.js";

export const getAllSessions = async (req, res) => {
  try {
    const session = await getSessionsQuery();
    res.status(200).json({ result: session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSessions = async (req, res) => {
  try {
    const session = await getSessionsByOrganisationQuery(req.user.organisation);
    res.status(200).json({ result: session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createSession = async (req, res) => {
  try {
    req.body.organisation = req.user.organisation;
    const session = await createSessionQuery(req.body);
    res.status(200).json({ result: session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSession = async (req, res) => {
  try {
    const session = await updateSessionQuery(req.body);
    res.status(200).json({ result: session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const Classrooms = await Classroom.find({ session: req.params.id });
    if (Classrooms.length) { 
      throw new Error(i18n.__("SESSION_CANNOT_DELETE")); 
    }
    const session = await deleteSessionQuery(req.params.id);
    res.status(200).json({ result: session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

