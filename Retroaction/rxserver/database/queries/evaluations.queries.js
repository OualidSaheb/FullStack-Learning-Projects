import mongoose from "mongoose";
import { Evaluation, Correction, Grid, Classroom} from "../models/index.js";
import isConstructorDeclaration from "typescript";

export const createEvaluationQuery = async (data) => {
  return Evaluation.create(data);
};

export const updateEvaluationQuery = (data) => {
  const evaluation = Evaluation.findOneAndUpdate({ _id: data._id }, { $set: data }, { new: true, runValidators: true });
  return evaluation;
};

export const deleteEvaluationQuery = async (id) => {
  console.log("running delete query on id ", id);
  return Evaluation.findByIdAndDelete(id);
};

//TODO: Tester si une grille d'une évaluation démarrée est réellement copié ou si c'est encore un lien...
export const cloneGridQuery = async (data) => {
  const evaluation = await Evaluation.findById(data).populate("classroom");
  const grid = await Grid.findById(evaluation.grid);
  if(!grid) throw new Error(`Grid #${evaluation.grid} not found`);
  evaluation.grid = grid.toObject();
  await evaluation.save();
  return evaluation;
};

export const startEvaluationQuery = async (data) => {
  const evaluation = await cloneGridQuery(data.evaluationId);
  evaluation.classroom.students.forEach((student) => {
    const existing = evaluation.corrections.find((correction) => correction.student == student);
    if (!existing) {
      const correction = { student: student, preresults: [], results: [] };

      evaluation.grid.sections.forEach((section) => {
        section.criteria.forEach((criterion) => {
          const result = { criterion: criterion._id, value: 0 };
          correction.results.push(result);
          correction.preresults.push(result);
        });
      });

      evaluation.corrections.push(correction);
    }
  });
  evaluation.state = "started";
  return evaluation.save();
};

/*export const updateCorrectionResultQuery = async (data) => {
  const evaluation = await Evaluation.findById(data.evaluationId);
  const correction = evaluation.corrections.find((correction) => correction._id.toString() == data.correctionId);
  let result = correction.results.find((result) => result._id.toString() == data.result._id);
  if (!result) throw new Error(`Result #${data.result._id} not found for correction #${data.correctionId}`);
  result.value = data.result.value;
  result.selection = data.result.selection;
  result.note = data.result.note;
  let foundResult = correction.results.find((result) => {
    return result.selection == null;
  });
  if (!foundResult) {
    correction.state = "completed";
  }
  let correctionsCompleted = evaluation.corrections.find((correction) => {
    return correction.state != "completed";
  });
  if (!correctionsCompleted) {
    evaluation.state = "completed";
  }
  await evaluation.save();
  return await this.getPopulatedEvaluation({ evaluationId: evaluation._id });
};*/

export const updateEvaluationStateQuery = async (data) => {
  return Evaluation.findOneAndUpdate({ _id: data.evaluationId }, { state: data.state }, { new: true });
};



/**
 * 
 * @param {*} data The correction object we need to change including the evaluationId
 * @returns The updated evaluation
 */
export const updateCorrectionQuery = async (correction) => {
  return Evaluation.findOneAndUpdate(
    { "corrections._id": correction._id },
    {
      $set: {
        "corrections.$[c].results": correction.results,
        "corrections.$[c].preresults": correction.preresults
      }
    },
    { 
      arrayFilters: [{ 'c._id': correction._id }], 
      new: true
    }
  );
};

export const getEvaluationGridQuery = async (data) => {
  return Evaluation.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(data.evaluationId),
      },
    },
    {
      $replaceRoot: {
        newRoot: "$grid",
      },
    },
  ]);
};

//BEWARE: This function doesn't return a document but the result of the update
/* "result": {
  "acknowledged": true,
  "modifiedCount": 1,
  "upsertedId": null,
  "upsertedCount": 0,
  "matchedCount": 1 */
export const updateCorrectionResultQuery = async (data) => {
  return Evaluation.updateOne(
    { _id: data.evaluationId },
    {
      $set: {
        "corrections.$[c].results.$[r].selection": data.result.selection,
        "corrections.$[c].results.$[r].value": data.result.value,
        "corrections.$[c].results.$[r].note": data.result.note,
      },
    },
    {
      arrayFilters: [{ "c._id": data.correctionId }, { "r._id": data.result._id }],
      new: true,
    }
  );
};

export const getPopulatedEvaluationQuery = async (data) => {
  return Evaluation.findById(data.evaluationId)
    .populate([
      {
        path: "classroom",
        populate: [
          { path: "students", model: "Student" },
          { path: "teachers", model: "Teacher" },
          { path: "course", model: "Course" },
        ],
      },
      //TODO: REMOVE THIS COMMENTARY
      { path: "grid", model: "Grid" },
      { path: "corrections", populate: [{ path: "student", model: "Student" }] },
    ])
    .exec();
};
export const getEvaluationQuery = async (data) => {
  return Evaluation.findById({ _id: data }).exec();
};

export const getEvaluationsByClassroomQuery = async (data) => {
  console.log(data.classroomId.toString());
  return Evaluation.find({ "classroom": data.classroomId });
};

/* export const populateEvaluationQuery = evaluation => {
  return evaluation.populate([
    {
      path: "classroom",
      populate: [
        { path: "students", model: "Student" },
        { path: "teachers", model: "Teacher" },
      ],
    },
    { path: "grid", model: "Grid" },
    { path: "corrections", populate: [{ path: "student", model: "Student" }] },
  ])
    .exec();
}; */

//TODO: Add the evaluation's grid all results to the good place
export const getCorrectionQuery = async (data) => {
  return Evaluation.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(data.evaluationId),
      },
    },
    {
      $project: {
        _id: 1,
        corrections: 1,
      },
    },
    {
      $unwind: {
        path: "$corrections",
      },
    },
    {
      $replaceRoot: {
        newRoot: "$corrections",
      },
    },
    {
      $match: {
        _id: new mongoose.Types.ObjectId(data.correctionId),
      },
    },
    {
      $limit: 1,
    },
  ]);
};

export const getCorrectionsByEvaluationQuery = async (data) => {
  return Correction.find({ evaluation: data.evaluationId });
};
