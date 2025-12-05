/**
 * ResultInterface defines the structure of a result within the application.
 *
 * @interface ResultInterface
 * @property {CriterionInterface} criterion - The criterion associated with the result.
 * @property {LevelInterface | null} selection - The selected level (or null if none selected).
 * @property {string} precision - The precision of the result.
 * @property {number} value - The numeric value of the result.
 * @extends {ModelInterface} - Inherits common properties from ModelInterface.
 */
import type { blob } from 'aws-sdk/clients/codecommit';
import type {
  GridInterface,
  ClassroomInterface,
  StudentInterface,
  LevelInterface,
  CriterionInterface,
  ModelInterface
} from './';

export type SelectionInterface = ResultInterface;

export interface ResultInterface extends ModelInterface {
  criterion: CriterionInterface;
  selection: LevelInterface | null;
  note: string;
  value: number;
  audioUrl: string | null;
  audioData?: blob;
}

/**
 * ResultFormInterface is a partial version of ResultInterface used for creating or updating result objects.
 *
 * @typedef ResultFormInterface
 * @type {Partial<ResultInterface>}
 */
export type ResultFormInterface = Partial<ResultInterface>;

/**
 * CorrectionInterface defines the structure of a correction within the application.
 *
 * @interface CorrectionInterface
 * @property {StudentInterface} student - The student associated with the correction.
 * @property {ResultInterface[]} preResults - An array of preliminary results.
 * @property {ResultInterface[]} results - An array of final results.
 * @property {string} precision - The precision of the correction.
 * @property {GridInterface | undefined} grid - The associated grid (optional).
 * @property {number | undefined} value - The numeric value of the correction (optional).
 * @property {string} state - The state of the correction.
 * @property {number} result - The final result value.
 * @extends {ModelInterface} - Inherits common properties from ModelInterface.
 */
export interface CorrectionInterface extends ModelInterface {
  student: StudentInterface;
  preResults: ResultInterface[];
  results: ResultInterface[];
  precision: string;
  grid?: GridInterface;
  value?: number;
  state: string;
  result: number;
}

/**
 * CorrectionFormInterface is a partial version of CorrectionInterface used for creating or updating correction objects.
 *
 * @typedef CorrectionFormInterface
 * @type {Partial<CorrectionInterface>}
 */
export type CorrectionFormInterface = Partial<CorrectionInterface>;

/**
 * EvaluationInterface defines the structure of an evaluation within the application.
 *
 * @interface EvaluationInterface
 * @property {string} code - The code or identifier of the evaluation.
 * @property {ClassroomInterface} class - The class or course associated with the evaluation.
 * @property {GridInterface} grid - The grid associated with the evaluation.
 * @property {boolean} public - Indicates whether the evaluation is public.
 * @property {string} state - The state of the evaluation.
 * @property {CorrectionInterface[]} corrections - An array of corrections associated with the evaluation.
 * @extends {ModelInterface} - Inherits common properties from ModelInterface.
 */
export interface EvaluationInterface extends ModelInterface {
  code: string;
  classroom: ClassroomInterface | string;
  grid: GridInterface;
  published: boolean;
  state: string;
  corrections: CorrectionInterface[];
}

/**
 * EvaluationFormInterface is a partial version of EvaluationInterface used for creating or updating evaluation objects.
 *
 * @typedef EvaluationFormInterface
 * @type {Partial<EvaluationInterface>}
 */
export type EvaluationFormInterface = Partial<EvaluationInterface>;
