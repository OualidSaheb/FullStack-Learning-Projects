/**
 * ModelInterface is an interface that defines the common properties
 * shared by multiple data models in the application.
 *
 * @interface ModelInterface
 * @property {string} state - The state of the data model.
 * @property {OrganisationInterface} [organisation] - An associated organisation, if applicable.
 * @property {string} id - The unique identifier of the data model.
 * @property {string} note - Additional notes or comments related to the data model.
 * @property {string} createdAt - The timestamp when the data model was created.
 * @property {string} updatedAt - The timestamp when the data model was last updated.
 */

import type { OrganisationInterface } from '.';
import type { EntityInterface } from './Entity.interface';

export interface ModelInterface extends EntityInterface {
  state: string;
  organisation?: OrganisationInterface;
  note: string;
  createdAt: string;
  updatedAt: string;
}
