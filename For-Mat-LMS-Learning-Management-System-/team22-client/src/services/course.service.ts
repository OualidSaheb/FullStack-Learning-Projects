import axios from "axios";
import type { Course } from "@/interfaces/Main.interface.ts"

const connexionString = "http://localhost:5297"
const courseConnexion=connexionString+"/api/course/"

export async function getAllCourses(){ 
    const response = await axios.get(courseConnexion);
    if (!response.data?.error) {
        return response.data;
      } else {
        throw new Error("Erreur dans la récupération des cours" + response.data.error);
      }
}

export async function getCourseById(id:number){ 
    const response =  await axios.get(courseConnexion+ id); 
    if (!response.data?.error) {
        return response.data;
      } else {
        throw new Error("Erreur la récupération du cours " + id + " " + response.data.error);
      }
}

export async function addCourse(course:Partial<Course>){ 
  //console.log("2",course)  
  const response =  await axios.post(courseConnexion,course);
    
    if (!response.data?.error) {
        return response.data;
      } else {
        throw new Error("Erreur dans l'ajout d'un cours " + response.data.error);
      }
}

export async function updateCourseById(course:Partial<Course>,id:number){ 
    const response =  await axios.put(courseConnexion+id,course);
    if (!response.data?.error) {
        return response.data;
      } else {
        throw new Error("Erreur dans l'actualisation d'un cours " + response.data.error);
      }
}

export async function deleteCourseById(id:number){ 
    const response =  await axios.delete(courseConnexion+ id); 
    if (!response.data?.error) {
        return response.data;
      } else {
        throw new Error("Erreur dans la suppression d'un cours " + response.data.error);
      }
}