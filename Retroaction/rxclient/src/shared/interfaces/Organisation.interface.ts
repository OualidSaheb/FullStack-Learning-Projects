/**
 * DepartmentInterface defines the structure of a department within the application.
 *
 * @interface DepartmentInterface
 * @property {string} code - The code or identifier of the department.
 * @property {string} name - The name of the department.
 * @extends {ModelInterface} - Inherits common properties from ModelInterface.
 */
import type { ModelInterface } from './';

export interface DepartmentInterface extends ModelInterface {
  code: string;
  name: string;
}

/**
 * ProgramInterface defines the structure of a session within the application.
 *
 * @interface ProgramInterface
 * @property {string} code - The code or identifier of the program.
 * @property {string} name - The name of the program.
 * @property {DepartmentInterface} department - The department the program belongs to.
 * @extends {ModelInterface} - Inherits common properties from ModelInterface.
 */

export interface ProgramInterface extends ModelInterface {
  code: string;
  name: string;
  department: DepartmentInterface;
}

/**
 * ProgramFormInterface is a partial version of ProgramInterface used for creating or updating session objects.
 *
 * @typedef ProgramFormInterface
 * @type {Partial<ProgramInterface>}
 */
export type ProgramFormInterface = Partial<ProgramInterface>;

/**
 * DepartmentFormInterface is a partial version of DepartmentInterface used for creating or updating department objects.
 *
 * @typedef DepartmentFormInterface
 * @type {Partial<DepartmentInterface>}
 */
export type DepartmentFormInterface = Partial<DepartmentInterface>;

/**
 * OrganisationInterface defines the structure of an organization within the application.
 *
 * @interface OrganisationInterface
 * @property {string} code - The code or identifier of the organization.
 * @property {string} name - The name of the organization.
 * @property {string} domain - The domain associated with the organization.
 * @property {string | undefined} logo - The optional URL of the organization's logo.
 * @extends {ModelInterface} - Inherits common properties from ModelInterface.
 */
export interface OrganisationInterface extends ModelInterface {
  code: string;
  name: string;
  domain: string;
  logo?: string;
}

/**
 * OrganisationFormInterface is a partial version of OrganisationInterface used for creating or updating organization objects.
 *
 * @typedef OrganisationFormInterface
 * @type {Partial<OrganisationInterface>}
 */
export type OrganisationFormInterface = Partial<OrganisationInterface>;
