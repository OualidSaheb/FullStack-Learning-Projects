import { Classroom } from "../models/index.js";
import mongoose from "mongoose";

export const getAllClassroomsQuery = () => {
  return Classroom.find({});
};

export const getAllClassroomsForSessionQuery = ({ sessionId }) => {
  return Classroom.find({ session: sessionId });
};

/* export const getClassroomsByDepartmentForSessionQuery = async ({ user, sessionId }) => {
  const Classrooms = await Classroom.find({ session: sessionId }).populate("course").lean();
  return Classrooms.filter(c => c.course.department.toString() === user.department.toString());
};  */

export const getClassroomsByDepartmentForSessionQuery = ({ user, sessionId }) => {
  return Classroom.aggregate([
    { $match: { session: sessionId } },
    { $lookup: { 
      from: 'courses', 
      localField: 'course', 
      foreignField: '_id', 
      as: 'course' 
    },
    },
    { $unwind: '$course' },
    { $lookup: { 
      from: 'groups', 
      localField: 'group', 
      foreignField: '_id', 
      as: 'group' 
    }
    },
    { $unwind: '$group' },
    { $match: { 'course.department': user.department} },
  ]);
};

//TODO: Filter the Classrooms by the user's Classroomassociation
export const getClassroomsByUserForSessionQuery = async ({ user, sessionId }) => {
  return Classroom.find({ session: sessionId, students: { _id: user._id } }).populate("course").exec();
};

export const getClassroomsByGroupQuery = async({groupId}) => {
  return Classroom.find({group: groupId});
};

export const getPopulatedClassroomQuery = async (classId) => {
  return Classroom.findById(classId).populate("course session group students teachers").exec();
  // return Classroom.findById(classId);
};

export const createClassroomQuery = async (data) => {
  return Classroom.create(data);
};

export const updateClassroomQuery = (classroom) => {
  delete classroom.state;
  const updatedClassroom = Classroom.findByIdAndUpdate(classroom._id, classroom, { new: true });
  return updatedClassroom;
};

export const deleteClassroomQuery = (classroomId) => {
  return Classroom.findByIdAndRemove(classroomId);
};

export const getClassroomCourseQuery = async classroomId => {
  const classroom = await Classroom.findById(classroomId);
  return classroom.course;
};
