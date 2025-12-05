/**
 * EntityInterface is an interface that defines the common properties
 * shared by multiple data models in the application.
 *
 * @interface EntityInterface
 * @property {string} [type] - An optional type identifier for the data model.
 * @property {string} id - The unique identifier of the data model.
 * @property {string} title - The title of the entity.
 */

export interface EntityInterface {
  _id: string;
  type?: string;
  isNew: true;
  title: string;
}
