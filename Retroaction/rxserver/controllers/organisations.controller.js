import { createOrganisationQuery, getOrganisationsQuery } from "../database/queries/organisations.queries.js";

export const createOrganisation = async (req, res) => {
  try {
    const Organisation = await createOrganisationQuery(req.body);
    res.status(200).json({ result: Organisation });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

export const getOrganisations = async (req, res) => {
  try {
    const Organisations = await getOrganisationsQuery();
    res.status(200).json({ result: Organisations });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};
