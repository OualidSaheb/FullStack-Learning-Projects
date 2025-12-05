/**
 * LevelInterface defines the structure of a level within the application.
 *
 * @interface LevelInterface
 * @property {number} value - The numeric value of the level.
 * @extends {EntityInterface} - Inherits common properties from ModelInterface.
 */
import type { ModelInterface } from './';
import type { EntityInterface } from './';
import type { UserInterface } from './';

export interface LevelInterface extends EntityInterface {
  value: number;
}

export type LevelFormInterface = Partial<LevelInterface>;
export type CriterionFormInterface = Partial<CriterionInterface>;

/**
 * CriterionInterface defines the structure of a criterion within the application.
 *
 * @interface CriterionInterface
 * @property {LevelInterface[]} levels - An array of levels associated with the criterion.
 * @extends {ModelInterface} - Inherits common properties from ModelInterface.
 */
export interface CriterionInterface extends ModelInterface {
  levels: Array<LevelInterface | LevelFormInterface>;
}

export type SectionFormInterface = Partial<SectionInterface>;

/**
 * SectionInterface defines the structure of a section within the application.
 *
 * @interface SectionInterface
 * @property {CriterionInterface[]} [criteria] - An optional array of criteria associated with the section.
 * @extends {ModelInterface} - Inherits common properties from ModelInterface.
 */
export interface SectionInterface extends ModelInterface {
  criteria: Array<CriterionInterface | CriterionFormInterface>;
}

export type GridFormInterface = Partial<GridInterface>;

/**
 * GridInterface defines the structure of a grid within the application.
 *
 * @interface GridInterface
 * @property {string} code - The code or identifier of the grid.
 * @property {string} course - The course associated with the grid.
 * @property {SectionInterface[]} sections - An array of sections within the grid.
 * @property {string} kind - The kind or type of the grid.
 * @extends {ModelInterface} - Inherits common properties from ModelInterface.
 */
export interface GridInterface extends ModelInterface {
  code: string;
  course: string; // courseid
  sections: Array<SectionInterface | SectionFormInterface>
  kind: string;
  isUserGrid: boolean;
}

export type UserGridFormInterface = Partial<UserGridInterface>;

/**
 * UserGridInterface extends GridInterface to include user-specific properties.
 *
 * @interface UserGridInterface
 * @property {UserInterface} teacher - The teacher associated with the grid.
 * @property {string} source - The source of the grid.
 * @extends {GridInterface} - Inherits properties from GridInterface.
 */
export interface UserGridInterface extends GridInterface {
  teacher: UserInterface;
  source: string;
}
