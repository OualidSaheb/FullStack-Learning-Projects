import { Department } from "../models/index.js";
import { getDefaultDepartment } from "../../config/defaultData.js";

export const getDepartmentsQuery = () => {
  return Department.find({});
};

export const getDepartmentsByOrganisationQuery = (organisation) => {
  return Department.find({ organisation: organisation });
};

export const createDepartmentQuery = async (department) => {
  return Department.create(department);
};

export const updateDepartmentQuery = async (department) => {
  return Department.findByIdAndUpdate(department._id, department, { new: true });
};

export const deleteDepartmentQuery = async (departmentId) => {
  return Department.findByIdAndDelete(departmentId);
};