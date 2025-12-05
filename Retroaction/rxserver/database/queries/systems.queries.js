import { System } from "../models/index.js";

export const getSystemParametersQuery = (organisation) => {
  return System.findOne({  }); //TODO: Make this with by organisation
};