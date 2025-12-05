import { defineStore } from 'pinia'

import type { Chapter, Course, CoursData, Examen } from '@/interfaces/Main.interface'

export const useCourseTestStore = defineStore({
  id: 'course',
  state: () => ({
    backendCourse: null as Course | null,
    courses: JSON.parse(localStorage.getItem('courses') ?? '[]') as CoursData[],
    currentOperation: null as 'add' | 'edit' | null,
    editingCourseId: null as number | null,
    currentVideoTitle: '',
    selectedCourse: null as Course | null,
    currentLesson: {
      id: 0,
      name: '',
      videoUrl: '',
      text: '',
      videoLength: 0
    },
    currentContext: {
      courseId: 0,
      sectionId: 0,
      currentChapterId: 0
    },
    examScore: 0,
    isExamCompleted: false
  }),
  getters: {
    getCourses(state) {
      return state.courses.flatMap((data) => data.cours)
    },
    getCourseById(state) {
      return (courseId: number) =>
        state.courses.flatMap((data) => data.cours).find((course) => course.id === courseId) || null
    },
    getSelectedCourse(state) {
      return (
        state.selectedCourse || {
          id: 0,
          code: '',
          name: '',
          description: '',
          imageUrl: '',
          publisher: '',
          content: [
            {
              id: 1,
              name: '',
              description: '',
              chapters: []
            }
          ]
        }
      )
    },

    progression: (state) => (courseId: number) => {
      const course = state.courses
        .flatMap((courseData) => courseData.cours)
        .find((c) => c.id === courseId)
      if (!course) return '0%'

      const totalChapters = course.content.flatMap((section) => section.chapters).length
      const completedChapters = course.content
        .flatMap((section) => section.chapters)
        .filter((chapter) => chapter.status === 'completed').length

      return ((completedChapters / totalChapters) * 100).toFixed(0) + '%'
    },

    getChapterById(state) {
      return (courseId: number, sectionId: number, chapterId: number): Chapter | null => {
        const course = this.getCourseById(courseId)
        if (!course) return null

        const section = course.content.find((sec) => sec.id === sectionId)
        if (!section) return null

        return section.chapters.find((chap) => chap.id === chapterId) || null
      }
    },
    getBackendCourse(state) {
      return state.backendCourse
    }
  },

  actions: {
    startAddingCourse() {
      this.currentOperation = 'add'
      this.editingCourseId = null
    },
    startEditingCourse(courseId: number) {
      this.currentOperation = 'edit'
      this.editingCourseId = courseId
    },
    getSectionIdForChapter(chapterId: number): number | null {
      for (const courseData of this.courses) {
        for (const course of courseData.cours) {
          for (const section of course.content) {
            for (const chap of section.chapters) {
              if (chap.id === chapterId) {
                return section.id
              }
            }
          }
        }
      }
      return null
    },
    setCurrentContext(courseId: number, sectionId: number, chapterId: number) {
      this.currentContext = { courseId, sectionId, currentChapterId: chapterId }
    },
    initializeChapters(courseId: number) {
      const course = this.getCourseById(courseId)
      if (course) {
        course.content.forEach((section) => {
          section.chapters.forEach((chapter, index) => {
            if (chapter.status !== 'completed') {
              chapter.status = 'closed'
            }
          })
        })
      }
    },
    setChapterStatus(
      courseId: number,
      sectionId: number,
      chapterId: number,
      status: 'closed' | 'open' | 'completed'
    ) {
      const chapter = this.getChapterById(courseId, sectionId, chapterId)
      if (chapter) {
        chapter.status = status

        if (status === 'completed') {
          const course = this.getCourseById(courseId)
          if (!course) return

          const section = course.content.find((sec) => sec.id === sectionId)
          if (!section) return

          const currentIndex = section.chapters.findIndex((chap) => chap.id === chapterId)
          const nextChapter = section.chapters[currentIndex + 1]
          if (nextChapter) {
            nextChapter.status = 'open'
          }
        }
      }
    },
    getNextChapter(courseId: number, sectionId: number, currentChapterId: number) {
      const course = this.getCourseById(courseId)
      if (!course) return null

      const section = course.content.find((sec) => sec.id === sectionId)
      if (!section) return null

      const currentIndex = section.chapters.findIndex((chap) => chap.id === currentChapterId)
      return section.chapters[currentIndex + 1] || null
    },
    setCurrentVideoTitle(title: string) {
      this.currentVideoTitle = title
    },
    setCurrentLesson(chapter: Chapter) {
      this.currentLesson = chapter
    },
    addCourse(newCourse: CoursData) {
      this.courses.push(newCourse)
    },
    setSelectedCourse(course: Course) {
      this.selectedCourse = course
    },
    async updateCourse(courseId: number, updatedFields: Partial<Course>) {
      console.log('1', updatedFields)
      // await addCourse(updatedFields)
    },
    startExam(courseId: number) {
      const course = this.getCourseById(courseId)
      if (!course) return

      if (course.exam) {
        // Reset the score and completion status at the start
        this.examScore = 0
        this.isExamCompleted = false
      }
    },

    submitExamAnswers(courseId: number, answers: Map<number, number>) {
      const course = this.getCourseById(courseId)
      if (!course || !course.exam) return

      let totalScore = 0

      course.exam.questions.forEach((question) => {
        const chosenAnswer = answers.get(question.id)
        if (chosenAnswer !== undefined) {
          const answer = question.answers[chosenAnswer]
          totalScore += (answer.weight / 100) * question.weight
        }
      })

      this.examScore = totalScore
      this.isExamCompleted = true
    },
    saveBackendCourse(newCourse: Course) {
      this.backendCourse = newCourse
    },
    addExamToCourse(exam: Examen) {
      if (this.backendCourse) {
        this.backendCourse.exam = exam
      }
    },
    removeExamFromCourse() {
      if (this.backendCourse && this.backendCourse.exam) {
        this.backendCourse.exam = null
      }
    },
    setCourses(newCourses: CoursData[]) {
      // UPDATE dans le local storage & dans le store
      this.courses = newCourses
      this.saveCoursesToLocalStorage()
    },
    saveCoursesToLocalStorage() {
      // CREATE sauvegarder les cours dans le local storage
      localStorage.setItem('courses', JSON.stringify(this.courses))
    },
    loadCoursesFromLocalStorage() {
      // LOAD charger les cours depuis le local storage
      const coursesFromStorage = localStorage.getItem('courses')
      if (coursesFromStorage) {
        this.courses = JSON.parse(coursesFromStorage)
      }
    },
    clearCoursesFromLocalStorage() {
      // DELETE supprimer les cours du local storage
      localStorage.removeItem('courses')
      this.courses = []
    }
  }
})
