/**
 * UserInterface defines the structure of a user within the application.
 *
 * @interface UserInterface
 * @property {string} code - The code or identifier of the user.
 * @property {string} firstName - The first name of the user.
 * @property {string} lastName - The last name of the user.
 * @property {object} local - Local user data.
 * @property {string} local.email - The email address of the user.
 * @property {string} kind - The kind or type of user.
 * @property {string} avatar - The URL of the user's avatar.
 * @property {DepartmentInterface} department - The department associated with the user.
 * @property {boolean} isAdmin - Indicates whether the user is an administrator.
 * @property {boolean} isCoordinator - Indicates whether the user is a coordinator.
 * @property {string} resetPassToken - Token for resetting the user's password.
 * @property {string} state - The state of the user.
 * @extends {ModelInterface} - Inherits common properties from ModelInterface.
 */
import type { DepartmentInterface, ModelInterface, OrganisationInterface } from './';

export interface UserAssignmentInterface {
  department: DepartmentInterface;
  isCoordinator: boolean;
}
export interface UserInterface extends ModelInterface {
  code: string;
  firstName: string;
  lastName: string;
  local: {
    email: string;
  };
  kind: string;
  avatar: string;
  departmentSelected: DepartmentInterface;
  departments: DepartmentInterface[];
  organisation: OrganisationInterface;
  isAdmin: boolean;
  resetPassToken: string;
  state: string;
}

/**
 * UserFormInterface is a partial version of UserInterface used for creating or updating user objects.
 *
 * @typedef UserFormInterface
 * @type {Partial<UserInterface>}
 */
export type UserFormInterface = Partial<UserInterface>;

/**
 * TeacherInterface extends UserInterface to include teacher-specific properties.
 *
 * @interface TeacherInterface
 * @property {DepartmentInterface[]} departments - An array of departments associated with the teacher.
 * @extends {UserInterface} - Inherits properties from UserInterface.
 */
export interface TeacherInterface extends UserInterface {
  assignments: UserAssignmentInterface[];
  isCoordinator: boolean;
}

/**
 * TeacherFormInterface is a partial version of TeacherInterface used for creating or updating teacher objects.
 *
 * @typedef TeacherFormInterface
 * @type {Partial<TeacherInterface>}
 */
export type TeacherFormInterface = Partial<TeacherInterface>;

/**
 * StudentInterface extends UserInterface to represent a student.
 *
 * @interface StudentInterface
 * @extends {UserInterface} - Inherits properties from UserInterface.
 */
export interface StudentInterface extends UserInterface {}

/**
 * StudentFormInterface is a partial version of StudentInterface used for creating or updating student objects.
 *
 * @typedef StudentFormInterface
 * @type {Partial<StudentInterface>}
 */
export type StudentFormInterface = Partial<StudentInterface>;

/**
 * SignInFormInterface defines the structure of a login form.
 *
 * @interface SignInFormInterface
 * @property {string} password - The user's password.
 * @property {string} email - The user's email address.
 */
export interface SignInFormInterface {
  password: string;
  email: string;
}
