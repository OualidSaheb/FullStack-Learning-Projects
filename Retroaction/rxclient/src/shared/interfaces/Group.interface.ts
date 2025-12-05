/**
 * GroupInterface defines the structure of a group within the application.
 *
 * @interface GroupInterface
 * @property {string} code - The code or identifier of the group.
 * @property {ProgramInterface | undefined} program - The program the group is associated with. Optional.
 * @property {StudentInterface[]} students - An array of students in the group.
 * @extends {ModelInterface} - Inherits common properties from ModelInterface.
 */
import type { ProgramInterface } from './Organisation.interface.ts';
import type { ModelInterface } from './Model.interface.js';
import type { StudentInterface } from './User.interface';

export interface GroupInterface extends ModelInterface {
  code: string;
  program: ProgramInterface | undefined;
  students: [StudentInterface];
}

/**
 * GroupFormInterface is a partial version of GroupInterface used for creating or updating group objects.
 *
 * @typedef GroupFormInterface
 * @type {Partial<GroupInterface>}
 */
export type GroupFormInterface = Partial<GroupInterface>;
