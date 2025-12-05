import mongoose from "mongoose";

import {
  createEvaluationQuery,
  startEvaluationQuery,
  updateCorrectionResultQuery,
  getPopulatedEvaluationQuery,
  updateEvaluationStateQuery,
  getEvaluationQuery,
  deleteEvaluationQuery,
  updateEvaluationQuery,
  getCorrectionQuery,
  updateCorrectionQuery,
  getEvaluationGridQuery,
  getEvaluationsByClassroomQuery,
  getCorrectionsByEvaluationQuery,
} from "../database/queries/evaluations.queries.js";
import { Grid, Evaluation, Correction, Student, Teacher } from "../database/models/index.js";
import { getClassroomsByGroupQuery } from "../database/queries/classrooms.queries.js";

export const getClassroomEvaluations = async (req, res) => {
  try {
    const classroomId = req.params.classroomId;

    const evaluations = await Evaluation.find({ classroom: classroomId }).populate("grid");

    /*     const evaluations = await Evaluation.aggregate([
      { $match: { 'class': new mongoose.Types.ObjectId(classId)} },
      { $lookup: { 
        from: 'grids', 
        localField: 'grid', 
        foreignField: '_id', 
        as: 'grid' 
      } },
      { $unwind: '$grid' },

    ]); */
    res.status(200).json({ result: evaluations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createEvaluation = async (req, res) => {
  try {
    const evaluation = await createEvaluationQuery(req.body);
    const populatedEvaluation = await getPopulatedEvaluationQuery({ evaluationId: evaluation._id });
    res.status(200).json({ result: populatedEvaluation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const deleteEvaluation = async (req, res) => {
  try {
    //console.log("Trying to delete", req.params);
    const evaluation = await deleteEvaluationQuery(req.params.evaluationId);

    res.status(200).json({ result: evaluation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudentClassroomCorrections = async (req, res) => {
  try {
    const corrections = await Evaluation.aggregate([
      {
        $match: {
          classroom: req.params.classroomId,
        },
      },
      {
        $project: {
          _id: 0,
          corrections: "$corrections",
        },
      },
      {
        $unwind: {
          path: "$corrections",
        },
      },
      {
        $match: {
          "corrections.student": req.user._id,
        },
      },
      {
        $replaceRoot: {
          newRoot: "$corrections",
        },
      },
    ]);
    res.status(200).json({ result: corrections });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEvaluationState = async (req, res) => {
  try {
    // check correction CURRENT state
    let targetState = req.body.targetState;
    let evaluation = await getEvaluationQuery(req.params.evaluationId);
    let currentState = evaluation.state;
    let response;
    let error;

    if (targetState == currentState) {
      res.json({ error: "Wtf you doing, the target state is the same as the current state !" });
      return;
    }

    switch (currentState) {
    case "created": {
      if (targetState != "published") {
        error = "You can't skip publishing";
        // error
      } else {
        //console.log("from created to published");
        await updateEvaluationStateQuery({ evaluationId: evaluation._id, state: targetState });
        response = await getPopulatedEvaluationQuery({ evaluationId: evaluation._id });
      }
      break;
    }
    case "published": {
      if (targetState == "created") {
        //console.log("from published to created");
        await updateEvaluationStateQuery({ evaluationId: evaluation._id, state: targetState });
        response = await getPopulatedEvaluationQuery({ evaluationId: evaluation._id });
      }
      if (targetState == "started") {
        //console.log("from published to started");
        await updateEvaluationStateQuery({ evaluationId: evaluation._id, state: targetState });
        response = await getPopulatedEvaluationQuery({ evaluationId: evaluation._id });
      }
      break;
    }
    case "started": {
      if (targetState == "completed") {
        await updateEvaluationStateQuery({ evaluationId: evaluation._id, state: targetState });
        response = await getPopulatedEvaluationQuery({ evaluationId: evaluation._id });
      }
      break;
    }
    case "completed": {
      if (targetState == "closed") {
        //console.log("from completed to CLOSED");
        await updateEvaluationStateQuery({ evaluationId: evaluation._id, state: targetState });
        response = await getPopulatedEvaluationQuery({ evaluationId: evaluation._id });
      }
      break;
    }
    case "closed": {
      break;
    }
    case "exported": {
      break;
    }
    default: {
      break;
    }
    }
    // check if next state is valid to be changed
    // if yes, change state
    // if not, send appropriate error message back
    //console.log("Update state from ", evaluation.state, " to ", targetState, " on ", evaluation._id);
    res.status(200).json({ result: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const startEvaluation = async (req, res) => {
  try {
    await startEvaluationQuery({ evaluationId: req.params.evaluationId });
    const evaluation = await getPopulatedEvaluationQuery({ evaluationId: req.params.evaluationId });
    res.status(200).json({ result: evaluation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEvaluation = async (req, res) => {
  try {
    //TODO: Ajouter le code pour transformer les blods en url AWS S3
    await updateEvaluationQuery(req.body);
    const evaluation = await getPopulatedEvaluationQuery({ evaluationId: req.params.evaluationId });
    res.status(200).json({ result: evaluation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const closeEvaluation = async (req, res) => {
  try {
    // TODO: implement...
    res.status(200).json({ result: evaluation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//TODO: Rework this functionnality with direct calls
export const updateCorrectionResult = async (req, res) => {
  try {
    //"result ", req.body.result);
    const evaluationId = req.params.evaluationId;
    const correctionId = req.params.correctionId;
    const result = await updateCorrectionResultQuery({ evaluationId, correctionId, result: req.body.result });
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

export const getCourseEvaluations = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const evaluations = await Evaluation.aggregate([
      {
        $lookup: {
          from: "Classrooms",
          localField: "class",
          foreignField: "_id",
          as: "class",
        },
      },
      { $unwind: "$class" },
      { $match: { "classroom.course": new mongoose.Types.ObjectId(courseId) } },
      {
        $lookup: {
          from: "grids",
          localField: "grid",
          foreignField: "_id",
          as: "grid",
        },
      },
      { $unwind: "$grid" },
    ]);
    res.status(200).json({ result: evaluations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find()
      .populate({
        path: "classroom",
        populate: { path: "course", model: "Course", select: "title" },
        select: "course grid",
      })
      .populate({
        path: "grid",
        model: "Grid",
        select: "name",
      });
    res.status(200).json({ result: evaluations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPopulatedEvaluation = async (req, res) => {
  try {
    const evaluation = await getPopulatedEvaluationQuery({ evaluationId: req.params.evaluationId });
    res.status(200).json({ result: evaluation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCorrection = async (req, res) => {
  try {
    const corrections = await getCorrectionQuery({ evaluationId: req.params.evaluationId, correctionId: req.params.correctionId });
    res.status(200).json({ result: corrections[0] }); //index 0
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGroupCorrections = async (req, res) => {
  try {
    const classrooms = await getClassroomsByGroupQuery({ groupId: req.params.groupId });
    const evaluations = [];
    const corrections = [];
    classrooms.forEach(async (classroom) => {
      evaluations.push(await getEvaluationsByClassroomQuery({ classroomId: classroom._id }));
    });
    evaluations.forEach(async (evaluation) => {
      corrections.push(await getCorrectionsByEvaluationQuery({ evaluationId: evaluation._id }));
    });
    res.status(200).json({ result: corrections });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//TODO: Pour l'instant ne retourne rien mais on pourrait relire la correction depuis getCorrection
export const updateCorrection = async (req, res) => {
  try {
    const evaluation = await updateCorrectionQuery(req.body);
    res.status(200).json({ result: evaluation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEvaluationGrid = async (req, res) => {
  try {
    const grid = await getEvaluationGridQuery({ evaluationId: req.params.evaluationId });
    res.status(200).json({ result: grid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGridEvaluations = async (req, res) => {
  try {
    const evaluations = await getGridEvaluationsQuery({ gridId: req.params.gridId });
    res.status(200).json({ result: evaluations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
/* export const getStudentCorrections = async (req, res) => {
  try {
    const { classId } = req.params;

    const studentId = req.user._id.toString();

    const evaluations = await Evaluation.find({ class: classId, "corrections.student": studentId }).lean();

    const corrections = evaluations
      .map((evaluation) => {
        return evaluation.corrections
          .filter((correction) => correction.student.toString() === studentId)
          .map((correction) => ({ ...correction, grid: evaluation.grid }));
      })
      .flat(1);

    res.status(200).json({ result: corrections });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; */
