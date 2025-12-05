<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useCourseTestStore } from '@/stores/courseReaderStore'
import type { Examen } from '@/interfaces/Main.interface'
import { generateExamCode } from '@/components/utils/Utils'
import Button from '@/components/Widgets/ButtonComp.vue'

const store = useCourseTestStore()

const showExamSection = ref(false)
const questionText = ref('')
const answers = ref([
  { answerText: '', weight: 0 },
  { answerText: '', weight: 0 },
  { answerText: '', weight: 0 },
  { answerText: '', weight: 0 }
])

const correctAnswerIndex = ref(0)

const exam = ref<Examen | null>(null)
const createNewExam = () => {
  exam.value = {
    code: generateExamCode(),
    name: '',
    weight: 100,
    questions: []
  }
}

const resetForm = () => {
  questionText.value = ''
  answers.value.forEach((a) => (a.answerText = ''))
  correctAnswerIndex.value = 0
}

const addQuestion = () => {
  answers.value.forEach((a) => (a.weight = 0))
  answers.value[correctAnswerIndex.value].weight = 100
  if (exam.value !== null) {
    const newQuestion = {
      id: exam.value.questions.length + 1,
      questionText: questionText.value,
      weight: 25,
      answers: JSON.parse(JSON.stringify(answers.value))
    }

    exam.value.questions.push(newQuestion)
    resetForm()
  }
}

const saveToLocalStorage = () => {
  const course = store.getBackendCourse
  if (course) {
    course.exam = JSON.parse(JSON.stringify(exam.value))
    // retrouve les cours existants
    const existingCourses = JSON.parse(localStorage.getItem('courses') || '[]')
    // ajoute le cours à la liste
    existingCourses.push(course)
    //  sauvegarde la liste des cours dans le local storage
    localStorage.setItem('courses', JSON.stringify(existingCourses))
  } else {
    console.warn('Course not found.')
  }
}

const toggleExamSection = () => {
  if (showExamSection.value) {
    if (!exam.value) {
      createNewExam()
    }
    if (exam.value !== null) {
      store.addExamToCourse(exam.value)
    }
  } else {
    store.removeExamFromCourse()
    exam.value = null
  }
}

watchEffect(() => {
  const course = store.getBackendCourse

  if (course && exam.value) {
    course.exam = JSON.parse(JSON.stringify(exam.value))
    store.saveBackendCourse(course)
  } else {
    console.warn('Course not found or exam is null.')
  }
})
</script>
<template>
  <div>
    <h2 class="creation-exam">
      Création d'un examen
      <label class="switch">
        <input type="checkbox" v-model="showExamSection" @change="toggleExamSection" />
        <span class="slider round"></span>
      </label>
    </h2>

    <div v-if="showExamSection">
      <div v-if="exam" class="exam">
        <div class="input-group">
          <label>Code</label>
          <input v-model="exam.code" placeholder="Entrez le code de l'examen" />
        </div>

        <div class="input-group">
          <label>Nom</label>
          <input v-model="exam.name" placeholder="Entrez le nom de l'examen" />
        </div>

        <h2 v-if="exam.questions">Création de la question Nº : {{ exam.questions.length + 1 }}</h2>
        <input v-model="questionText" placeholder="Entrez votre question" class="question" />
      </div>

      <div v-for="(answer, index) in answers" :key="index" class="answers">
        <input v-model="answer.answerText" :placeholder="'Réponse ' + (index + 1)" class="answers-input" />
        <div class="correct">
          <label class="radio-input">Correcte</label>
          <input type="radio" :value="index" v-model="correctAnswerIndex" />
        </div>
      </div>


      <div class="save">
        <button @click="addQuestion" class="btn-ajouter">+ Ajouter question</button>
        <Button @click="saveToLocalStorage" class="btn-save" btnText="Sauvegarder" btnColor="var(--textlight)"
          btnBgColor="var(--laccent)" btnHoverColor="var(--laccent)" btnHoverBgColor="var(--textlight)" />
      </div>
      <!-- <button @click="generateObject">Générer l'objet</button> -->
      <!-- <pre>{{ JSON.stringify(exam, null, 2) }}</pre> -->
    </div>
  </div>
</template>
<style scoped>
h2 {
  margin: 5px 0;
  font-weight: 600;
}

.exam h2 {
  margin-top: 30px;
  font-weight: 600;
}

.exam {
  margin: 10px;
}

.creation-exam {
  display: flex;
  align-items: center;
}

label {
  font-weight: 600;
  font-size: 14px;
  color: var(--daccent);
  margin: 3px 0;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.switch {
  margin-left: 40px;
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
}

input:checked+.slider {
  background-color: var(--laccent);
}

input:checked+.slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.exam input {
  margin: 5px 0;
  padding: 13px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
}

.question {
  margin: 10px 0;
  padding: 13px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  width: 90%;
}

.answers {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin: 10px;
}

.correct {
  display: flex;
  gap: 2px;

}

.answers-input {
  margin: 5px 0;
  padding: 13px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  width: 80%;
}

.radio-input {
  display: flex;
  padding: 0px;
  align-items: center;
  margin: 0px 5px;
}

.add-question-button {
  background-color: #2196f3;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

}

.btn-ajouter {
  color: var(--laccent);
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: transparent;
  border: none;
  font-weight: 600;
}

.btn-ajouter:hover {
  color: var(--daccent);

}

.save {
  display: flex;
  flex-direction: row;
  margin: 20px 10px;
  justify-content: space-between;
}

.btn-save {
  font-size: 14px;
  border: var(--laccent) solid 1px;
}

.btn-save:hover {
  border: var(--laccent) solid 1px;
}
</style>
