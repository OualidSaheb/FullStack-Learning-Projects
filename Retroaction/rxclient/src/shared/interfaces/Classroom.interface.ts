/**
 * ClassroomInterface defines the structure of a class within the application.
 *
 * @interface ClassroomInterface
 * @property {string} code - The unique code or identifier for the class.
 * @property {SessionInterface} session - The session associated with the class.
 * @property {CourseInterface} course - The course to which the class belongs.
 * @property {GroupInterface} group - The group to which the class belongs.
 * @property {StudentInterface[]} students - An array of students enrolled in the class.
 * @property {TeacherInterface[]} teachers - An array of teachers or instructors for the class.
 * @extends {ModelInterface} - Inherits common properties from ModelInterface.
 */
import type {
  SessionInterface,
  TeacherInterface,
  CourseInterface,
  StudentInterface,
  ModelInterface,
  GroupInterface
} from '.';

export interface ClassroomInterface extends ModelInterface {
  code: string;
  session: SessionInterface;
  course: CourseInterface;
  group: GroupInterface;
  students: StudentInterface[];
  teachers: TeacherInterface[];
}

/**
 * ClassFormInterface is a partial version of ClassroomInterface used for creating or updating class objects.
 *
 * @typedef ClassFormInterface
 * @type {Partial<ClassroomInterface>}
 */
export type ClassFormInterface = Partial<ClassroomInterface>;
