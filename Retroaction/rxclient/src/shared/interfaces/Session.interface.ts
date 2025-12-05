/**
 * SessionInterface defines the structure of a session within the application.
 *
 * @interface SessionInterface
 * @property {string} code - The code or identifier of the session.
 * @property {string} name - The name of the session.
 * @property {string} endsOn - The end date of the session.
 * @property {string} note - Additional notes or comments related to the session.
 * @extends {ModelInterface} - Inherits common properties from ModelInterface.
 */
import type { ModelInterface } from './';

export interface SessionInterface extends ModelInterface {
  code: string;
  name: string;
  endsOn: string;
  note: string;
}

/**
 * SessionFormInterface is a partial version of SessionInterface used for creating or updating session objects.
 *
 * @typedef SessionFormInterface
 * @type {Partial<SessionInterface>}
 */
export type SessionFormInterface = Partial<SessionInterface>;
