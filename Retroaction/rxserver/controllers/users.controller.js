import {
  findUserByEmailQuery,
  getAllUserQuery,
  createTeacherQuery,
  updateAvatarQuery,
  setCurrentDepartmentQuery,
  findOrCreateStudentQuery,
  findUserByIDQuery,
  getTeachersQuery,
  getStudentsQuery,
  updateTeacherQuery,
  deleteUserQuery,
  getTeachersByOrganisationQuery,
  getCoordinatorsByOrganisationQuery,
} from "../database/queries/users.queries.js";
import { findOrCreateGroupQuery } from "../database/queries/groups.queries.js";
import { i18n } from "../middlewares/i18n.middleware.js";
import csvtojson from "csvtojson";

// export const signup = async (req, res, next) => {
//   try {
//     const user = await createUser(req.body);
//     res.status(200).json({ result: user });
//   } catch (error) {
//     res.status(500).json({ error: error.stack });
//   }
// };

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await findUserByEmailQuery(req.user.local.email);
    res.status(200).json({ result: user });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

export const getAllUser = async (req, res, next) => {
  try {
    const users = await getAllUserQuery({});
    res.status(200).json({ result: users });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await findUserByIDQuery(req.params.id);
    res.status(200).json({ result: user });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

export const getUserByEmail = async (req, res, next) => {
  try {
    const user = await findUserByEmailQuery(req.body.email);

    if (user.state === "pending" || user.state === "created") {
      throw new Error("l'Utilisation n'a pas l'autorisation de changer son Mot de Passe");
    }

    res.status(200).json({ result: user });
  } catch (error) {
    console.log(error);
    res.status(200).json({ result: false });
    // Enlever pour eviter le modal d<erreur dans le front end
    // res.status(500).json({ error: error.stack });
  }
};

export const getStudents = async (req, res, next) => {
  try {
    const students = await getStudentsQuery();
    res.status(200).json({ result: students });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

export const getAllTeachers = async (req, res, next) => {
  try {
    const teachers = await getTeachersQuery();
    res.status(200).json({ result: teachers });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

export const getTeachers = async (req, res, next) => {
  try {
    const teachers = await getTeachersByOrganisationQuery(req.user.organisation);
    res.status(200).json({ result: teachers });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

export const getCoordinators = async (req, res, next) => {
  try {
    const coordinators = await getCoordinatorsByOrganisationQuery(req.user.organisation);
    res.status(200).json({ result: coordinators });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

export const createUserTeacher = async (req, res, next) => {
  try {
    const teacher = await createTeacherQuery(req.body);
    res.status(200).json({ result: teacher });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

export const updateTeacher = async (req, res, next) => {
  try {
    const teacher = await updateTeacherQuery(req.params.id, req.body);
    res.status(200).json({ result: teacher });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const user = await updateAvatarQuery(req.user._id, req.file);
    res.status(200).json({ result: user });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

// export const updateUserPassword = async (req, res, next) => {
//   try {
//     if (req.user) {
//       const newPassword = req.body.newPassword;
//       const match = await req.user.comparePassword(req.body.password);
//       if (match && newPassword?.length > 1) {
//         const newHashPassword = await User.hashPassword(newPassword);
//         req.user.local.password = newHashPassword;

//         await req.user.save();
//         res.status(200).json({ result: req.user });
//       } else {
//         throw new Error(i18n.__("PASSWORD_INVALID"));
//       }
//     } else {
//       throw new Error(i18n.__("CREDENTIALS_NOT_FOUND"));
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const createStudentData = (code, group, firstName, lastName, program) => {
  return { code: code, group: group, firstName: firstName, lastName: lastName, program: program };
};

export const validateStudentData = (data) => {
  return Object.values(data).every((value) => value ?? false);
};

export const importCSV = async (text) => {
  let students = [];

  await csvtojson({ delimiter: [",", ";"], ignoreEmpty: true })
    .fromString(text, { encoding: "latin1" })
    .then((json) => {
      json.forEach((data) => {
        let _student = this.createStudentData(...Object.values(data).map((o) => o.replace(/^="(.*)"$/, "$1")));

        if (this.validateStudentData(_student)) {
          students.push(_student);
        }
      });
    });

  return students;
};

export const createUsersFromCSV = async (req, res) => {
  try {
    if (typeof req.body.data !== "string") {
      throw new TypeError("A string is expected.");
    }
    //TODO Insert organisation _id in req.body
    const groups = [];

    const students = await this.importCSV(req.body.data);

    for (const data of students) {
      const student = await findOrCreateStudent(data);
      const group = await findOrCreateGroup(data.group, req.user.organisation);

      if (!group.students.includes(student._id)) {
        group.students.push(student);
      }

      await group.populate("students");

      await group.save();

      search = groups.find((n) => n.code === group.code);

      if (search) {
        Object.assign(search, group);
      } else {
        groups.push(group);
      }
    }

    res.status(200).json({ result: groups });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const setCurrentDepartment = async (req, res, next) => {
  try {
    const user = await setCurrentDepartmentQuery(req.user._id, req.body.departmentId);
    res.status(200).json({ result: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await deleteUserQuery(req.params.id);
    res.status(200).json({ result: user });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};
