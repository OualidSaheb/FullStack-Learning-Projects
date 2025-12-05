const ITEM_IMAGE_PATH = "/images/items/";
import { User, Teacher, Student, Department } from "../models/index.js";
import { i18n } from "../../middlewares/i18n.middleware.js";

export const findUserByIDQuery = (id) => {
  return User.findById(id, "-password").populate("assignments");
};

export const findUserByEmailQuery = async (email) => {
  const user = await User.findOne({ "local.email": email }).populate("organisation assignments department");
  return user;
};

export const findUserByCodeQuery = (code) => {
  return User.findOne({ code: code });
};

export const getAllUserQuery = () => {
  return User.find({});
};

export const getStudentsQuery = () => {
  return User.find({ kind: "Student" });
};

export const getTeachersQuery = () => {
  return User.find({ kind: "Teacher" });
};

export const getTeachersByOrganisationQuery = (organisation) => {
  return User.find({ kind: "Teacher", organisation: organisation });
};

export const getCoordinatorsByOrganisationQuery = (organisation) => {
  return User.find({kind: "Teacher", organisation: organisation, isCoordinator: true});
};

export const createTeacherQuery = async (data) => {
  let teacher = await User.findOne({ code: data.code });

  if (!teacher) {
    const hashedPassword = await User.hashPassword(data.code);
    teacher = new Teacher({
      organisation: data.organisation,
      code: data.code,
      firstName: data.firstName,
      lastName: data.lastName,
      local: {
        email: `${data.code}@cshawi.ca`, // email domain is hardcoded.
        password: hashedPassword,
      },
      assignments: data.assignments,
      department: data.assignments[0].department,
      note: data.note,
    });

    await teacher.save();
  }

  return teacher;
};

export const updateTeacherQuery = async (teacherId, data) => {
  // avec ce type d'update en une ligne le isCoordinator reste toujours à false
  // let teacher = await User.findByIdAndUpdate(teacherId, { $set: data }, { new: true });

  let teacher = await User.findById(teacherId);
  teacher.firstName = data.firstName;
  teacher.lastName = data.lastName;
  teacher.assignments = data.assignments;
  teacher.department = data.assignments[0].deparment;
  teacher.isCoordinator = data.isCoordinator;
  teacher.note = data.note;
  await teacher.save();

  return teacher;
};

// TODO: findOrCreateStudent, findOrCreateTeacher, etc. could be refactored into a findOrCreate(model, data).

//TODO Ajouter organisation _id dans les paramètres
export const findOrCreateStudentQuery = async (data) => {
  let student = await Student.findOne({ code: data.code });

  if (!student) {
    const hashedPassword = await User.hashPassword(data.code);
    // TODO mettre uuid à la place du code mot de passe

    student = new Student({
      firstName: data.firstName,
      lastName: data.lastName,
      local: {
        email: `${data.code}@cshawi.ca`, // FIXME: the email domain is hardcoded.
        password: hashedPassword,
      },
      code: data.code,
    });

    await student.save();
  }

  return student;
};

export const updateAvatarQuery = async (userId, avatar) => {
  const user = await User.findById(userId);
  if (!user) throw new Error(i18n.__("USER_NOT_FOUND", { userId }));
  user.avatar = avatar.path;
  await user.save();
  return user;
};

//TODO: Be sure the departmentId is present in assignments
export const setCurrentDepartmentQuery = async (userId, departmentId) => {
  const teacher = await Teacher.findById(userId);
  if (!teacher) throw new Error(i18n.__("USER_NOT_FOUND", { userId }));
  const department = await Department.findById(departmentId);
  if (!department) throw new Error(i18n.__("DEPARTMENT_NOT_FOUND", { departmentId }));
  teacher.department = department;
  return teacher.save();
};

export const setResetPassTokenQuery = async (userId, token) => {
  const user = await User.findById(userId);
  if (!user) throw new Error(i18n.__("USER_NOT_FOUND", { email }));
  user.resetPassToken = token;
  return user.save();
};

export const updateUserStateQuery = async (userId, state) => {
  const user = await User.findById(userId);
  if (!user) throw new Error(i18n.__("USER_NOT_FOUND", { userId }));
  user.state = state;
  return user.save();
};

export const deleteUserQuery = async (userId) => {
  return await User.findByIdAndDelete(userId);
};
