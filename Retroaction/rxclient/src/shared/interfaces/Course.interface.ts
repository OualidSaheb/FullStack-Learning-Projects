/**
 * CourseInterface defines the structure of a course within the application.
 *
 * @interface CourseInterface
 * @property {string} code - The unique code or identifier of the course.
 * @property {string} title - The title or name of the course.
 * @property {string} department - The department to which the course is associated.
 * @extends {ModelInterface} - Inherits common properties from ModelInterface.
 */
import type { ModelInterface } from './';

export interface CourseInterface extends ModelInterface {
  code: string;
  title: string;
  department: string; // departmentModelInterface but in back-end is nommed department
}

/**
 * CourseFormInterface is a partial version of CourseInterface used for creating or updating course objects.
 *
 * @typedef CourseFormInterface
 * @type {Partial<CourseInterface>}
 */
export type CourseFormInterface = Partial<CourseInterface>;
