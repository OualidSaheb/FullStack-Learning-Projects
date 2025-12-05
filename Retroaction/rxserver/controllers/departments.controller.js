import { getDepartmentsQuery, createDepartmentQuery, updateDepartmentQuery, deleteDepartmentQuery, getDepartmentsByOrganisationQuery } from "../database/queries/departments.queries.js";

export const getAllDepartments = async (req, res) => {
  try {
    const departments = await getDepartmentsQuery();
    res.status(200).json({ result: departments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const departments = await getDepartmentsByOrganisationQuery(req.user.organisation);
    res.status(200).json({ result: departments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    req.body.organisation = req.user.organisation;
    const department = await createDepartmentQuery(req.body);
    res.status(200).json({ result: department });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const department = await updateDepartmentQuery(req.body);
    res.status(200).json({ result: department });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const department = await deleteDepartmentQuery(req.params.id);
    res.status(200).json({ result: department });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
