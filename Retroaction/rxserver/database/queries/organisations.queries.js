import { Organisation } from "../models/index.js";

export const createOrganisationQuery = async (data) => {
  return Organisation.create(data);
};

export const getOrganisationsQuery = async () => {
  return Organisation.find({});
};

export const getOrganisationByIdQuery = async (organisationId) => {
  return Organisation.findById(organisationId);
};
