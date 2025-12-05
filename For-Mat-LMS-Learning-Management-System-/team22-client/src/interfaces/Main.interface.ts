export interface Chapter {
  id: number
  name: string
  videoUrl: string
  text: string
  videoLength: number
  status?: 'closed' | 'open' | 'completed'
}

export interface Section {
  id: number
  name: string
  description: string
  chapters: Chapter[]
}

export interface Course {
  id: number
  code: string
  name: string
  description: string
  imageUrl: string
  publisher: string
  content: Section[]
  exam?: Examen | null
}

export interface CoursData {
  cours: Course[]
}

export interface Examen {
  code: string
  name: string
  weight: number
  questions: Question[]
}
export interface Question {
  id: number
  questionText: string
  weight: number
  answers: Answer[]
}
export interface Answer {
  answerText: string
  weight: number
}
