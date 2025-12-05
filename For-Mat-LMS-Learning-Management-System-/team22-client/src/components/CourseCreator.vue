<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import FileUpload from '@/components/Widgets/FileUpload.vue'
import VideoRecorderComp from './VideoRecorderComp.vue'
import { useCourseTestStore } from '@/stores/courseReaderStore'
import { Icon } from '@iconify/vue'
import type { CoursData } from '@/interfaces/Main.interface'
import HeaderVert from '@/components/HeaderVert.vue'
import TestCreator from '@/components/TestCreator.vue'
import Button from '@/components/Widgets/ButtonComp.vue'
const store = useCourseTestStore()
import { useRouter } from 'vue-router'
const router = useRouter()
const courseJSON = ref<CoursData[]>([
  {
    cours: [
      {
        id: 1,
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
    ]
  }
])

const removeCourse = () => {
  console.log(' course removed')
}

const addSection = () => {
  const newId = getNextId(courseJSON.value[0].cours[0].content)

  courseJSON.value[0].cours[0].content.push({
    id: newId,
    name: '',
    description: '',
    chapters: []
  })
}

let nextChapterId = 1

const addChapter = (sectionIndex: number) => {
  const section = courseJSON.value[0].cours[0].content[sectionIndex]
  const newId = nextChapterId
  nextChapterId++

  courseJSON.value[0].cours[0].content[sectionIndex].chapters.push({
    id: newId,
    name: '',
    videoUrl: '',
    text: '',
    videoLength: 0
  })
}

const removeSection = (sectionIndex: number) => {
  courseJSON.value[0].cours[0].content.splice(sectionIndex, 1)
}

const removeChapter = (sectionIndex: number, chapterIndex: number) => {
  courseJSON.value[0].cours[0].content[sectionIndex].chapters.splice(chapterIndex, 1)
}

onMounted(() => {
  const selectedCourse = store.getSelectedCourse
  if (selectedCourse !== null) {
    courseJSON.value[0].cours[0] = { ...selectedCourse }
  }
})

const selectedSection = ref<number | null>(null)
const showContentDiv = ref(false)
const selectedChapter = ref<number | null>(null)

const selectedSectionForChapter = ref<number | null>(null)

const examenToggled = ref(false)

const toggleContentDiv = () => {
  showContentDiv.value = !showContentDiv.value
  selectedSection.value = -1
  selectedChapter.value = -1
  examenToggled.value = false
}
const toggleSection = (sectionIndex: number) => {
  selectedSection.value = sectionIndex
  showContentDiv.value = false
  selectedChapter.value = -1
  examenToggled.value = false
}

const toggleChapter = (chapterIndex: number, sectionIndex: number) => {
  selectedChapter.value = chapterIndex
  showContentDiv.value = false
  selectedSectionForChapter.value = sectionIndex
  selectedSection.value = -1
  examenToggled.value = false
}
const toggleExamen = () => {
  examenToggled.value = !examenToggled.value
  showContentDiv.value = false
  selectedSection.value = -1
  selectedChapter.value = -1
}
const isnotContentVisible = ref(false)
const toggleContentInvisibility = () => {
  isnotContentVisible.value = !isnotContentVisible.value
}
//WATCHERS
watchEffect(() => {
  const updatedCourse = courseJSON.value[0].cours[0]

  store.updateCourse(0, updatedCourse)

  store.saveBackendCourse(updatedCourse)
})

//Local Storage
const saveCourseAndRedirect = () => {
  // Récupérer l'ensemble du tableau depuis le stockage local, ou l'initialiser s'il est nul
  let storedCoursesArray = JSON.parse(localStorage.getItem('courses') || '[]')

  // S'il n'y a pas de champ "cours" dans le premier objet du tableau, ou si le tableau est vide, l'initialiser
  if (storedCoursesArray.length === 0 || !storedCoursesArray[0].cours) {
    storedCoursesArray = [{ cours: [] }]
  }

  // Récupérer le tableau "cours" du premier objet du tableau storedCoursesArray
  const storedCourses = storedCoursesArray[0].cours

  // Attribuer un nouvel ID au cours qui doit être sauvegardé
  const newCourseId = getNextId(storedCourses)
  const newCourse = {
    ...courseJSON.value[0].cours[0],
    id: newCourseId // Assurer que le cours a un ID unique
  }

  // Ajouter le nouveau cours dans le champ "cours" du premier objet
  storedCourses.push(newCourse)

  // Sauvegarder le tableau mis à jour retour dans le stockage local
  localStorage.setItem('courses', JSON.stringify(storedCoursesArray))

  // Rediriger vers la page d'accueil
  router.push('/')
}

const getNextId = (entities: Array<{ id: number }>) => {
  if (entities.length === 0) {
    return 1 // commence a 1
  }
  const highestId = entities.reduce((maxId, entity) => Math.max(entity.id || 0, maxId), 0)
  return highestId + 1
}
</script>

<template>
  <HeaderVert class="header"></HeaderVert>
  <main class="container">
    <div class="course-layout">
      <div class="left-panel">
        <div class="course-content-header">
          <h2>Gérez votre cours</h2>
          <!-- Collapsible Button -->
          <button v-if="!isnotContentVisible" @click="toggleContentInvisibility" class="collapsible-btn">
            <Icon icon="mdi:arrow-down" />
          </button>
          <button v-else @click="toggleContentInvisibility" class="collapsible-btn">
            <Icon icon="mdi:arrow-up" />
          </button>
        </div>
        <div class="course-content" :class="{ hidden: !isnotContentVisible }">
          <div class="course">
            <div class="Course-title" :class="{ active: showContentDiv === true }">
              Paramètres du cours
            </div>
            <div class="actions">
              <div @click="toggleContentDiv">
                <Icon class="icons edit" icon="ic:sharp-edit" />
              </div>
              <div @click="removeCourse()">
                <Icon class="icons delete" icon="ic:sharp-delete" />
              </div>
            </div>
            <!-- <h4>Contenu du cours</h4> -->
          </div>
          <div v-for="(section, sectionIndex) in courseJSON[0].cours[0].content" :key="sectionIndex">
            <div class="sections">
              <div class="section-title" :class="{ active: sectionIndex === selectedSection }">
                Section {{ sectionIndex + 1 }} : {{ section.name }}
              </div>
              <div class="actions">
                <div @click="toggleSection(sectionIndex)">
                  <Icon class="icons edit" icon="ic:sharp-edit" />
                </div>
                <div @click="removeSection(sectionIndex)">
                  <Icon class="icons delete" icon="ic:sharp-delete" />
                </div>
              </div>
            </div>

            <div v-for="(chapter, chapterIndex) in section.chapters" :key="chapterIndex">
              <div class="chapters">
                <div class="chapters-title" :class="{
                  active:
                    chapterIndex === selectedChapter && sectionIndex === selectedSectionForChapter
                }">
                  Chapitre {{ chapterIndex + 1 }} : {{ chapter.name }}
                </div>
                <div class="actions">
                  <div @click="toggleChapter(chapterIndex, sectionIndex)">
                    <Icon class="icons edit" icon="ic:sharp-edit" />
                  </div>
                  <div @click="removeChapter(sectionIndex, chapterIndex)">
                    <Icon class="icons delete" icon="ic:sharp-delete" />
                  </div>
                </div>
              </div>
            </div>

            <div @click="addChapter(sectionIndex)" class="btn-add-chapters">
              <Icon class="icons add" icon="ic:sharp-add" />
              <div>
                <p>Ajouter chapitre</p>
              </div>
            </div>
          </div>

          <div class="button-container">
            <div @click="addSection" class="btn-add-section">
              <Icon class="icons add" icon="ic:sharp-add" />
              <div>
                <p>Ajouter section</p>
              </div>
            </div>
          </div>


          <div class="sections">
            <div class="section-title" :class="{ active: examenToggled === true }">
              Examen
            </div>
            <div class="actions">
              <div @click="toggleExamen">
                <Icon class="icons edit" icon="ic:sharp-edit" />
              </div>
            </div>
          </div>


          <div class="save">
            <Button @click="saveCourseAndRedirect" class="btn-save" btnText="Sauvegarder" btnColor="var(--textlight)"
              btnBgColor="var(--laccent)" btnHoverColor="var(--laccent)" btnHoverBgColor="var(--textlight)" />
          </div>
          <!-- <pre>{{ JSON.stringify(courseJSON, null, 2) }}</pre> -->
        </div>
      </div>

      <div class="right-panel">
        <TestCreator :class="{ hiddenComponent: !examenToggled }"></TestCreator>

        <div class="course-profile" v-if="showContentDiv">
          <h2>Paramètres du cours</h2>
          <div class="form">
            <div class="input-group">
              <label>Code : </label>
              <input v-model="courseJSON[0].cours[0].code" />
            </div>

            <div class="input-group">
              <label>Nom : </label>
              <input v-model="courseJSON[0].cours[0].name" />
            </div>
            <div class="input-group">
              <label>Description : </label>
              <textarea v-model="courseJSON[0].cours[0].description"></textarea>
            </div>
            <div class="input-group-img">
              <label>Image du Cours : </label>
              <file-upload @url-uploaded="(url) => (courseJSON[0].cours[0].imageUrl = url)"></file-upload>
            </div>
          </div>
        </div>
        <div v-for="(section, sectionIndex) in courseJSON[0].cours[0].content" :key="sectionIndex">
          <div v-if="sectionIndex === selectedSection">
            <h2>Section {{ sectionIndex + 1 }}</h2>
            <div class="form">
              <div class="input-group">
                <label>Nom de la Section : </label>
                <input v-model="section.name" />
              </div>
              <div class="input-group">
                <label>Description de la Section : </label>
                <textarea v-model="section.description"></textarea>
              </div>
            </div>
          </div>
          <div v-for="(chapter, chapterIndex) in section.chapters" :key="chapterIndex">
            <div v-if="chapterIndex === selectedChapter && sectionIndex === selectedSectionForChapter">
              <h2>Chapitre {{ chapterIndex + 1 }}</h2>
              <div class="form">
                <div class="input-group">
                  <label>Nom du Chapitre : </label>
                  <input v-model="chapter.name" />
                </div>
                <div class="input-group">
                  <label>Texte du Chapitre : </label>
                  <textarea v-model="chapter.text"></textarea>
                </div>
                <div class="input-group">
                  <label>Durée de la vidéo : </label>
                  <input type="number" v-model="chapter.videoLength" />
                </div>
                <div class="input-group-img">
                  <label>Téléverser la vidéo : </label>
                  <file-upload class="bb" @url-uploaded="(url) => (chapter.videoUrl = url)"
                    @video-duration="(duration: number) => (chapter.videoLength = Number(duration))"></file-upload>
                </div>

                <div class="input-group-img">
                  <label>Filmer un vidéo : </label>
                  <VideoRecorderComp class="bb" @url-uploaded="(url) => (chapter.videoUrl = url)"
                    @video-duration="(duration: number) => (chapter.videoLength = Number(duration))"></VideoRecorderComp>
                </div>



              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.hiddenComponent {
  display: none;
}

h2 {
  margin: 5px 0;
  font-weight: 600;
}

h4 {
  font-size: 1.1rem;
  font-weight: 600;
}

.course-layout {
  display: flex;
  width: 90%;
  margin: auto;

  gap: 20px;
}

.left-panel {
  width: 40%;
  height: 100%;
  min-height: 100vh;
  background-color: var(--background);
  padding: 15px;
  border: var(--baccent) solid 1px;
}

.right-panel {
  width: 60%;
  padding: 20px;
}

.course-profile {
  width: 100%;
}

.active {
  background-color: var(--baccent);
  color: var(--daccent);
  width: 100%;
  padding: 5px;
}

.sections,
.chapters,
.actions,
.btn-add-chapters,
.btn-add-section,
.course {
  display: flex;
  align-items: center;
}

.sections {
  border-top: var(--baccent) solid 1px;
}

.sections,
.chapters,
.course {
  justify-content: space-between;
  gap: 10px;
}

.actions {
  gap: 5px;
}

.Course-title,
.section-title {
  color: var(--maccent);
  font-weight: 600;
  margin: 10px 0;
  line-height: 1.1;
}

.section-title {
  font-size: 14px;
}

.Course-title {
  font-size: 16px;
}

.chapters-title,
.btn-add-chapters P {
  font-size: 14px;
}

.chapters {
  margin: 0 0 6px 10px;
}

.icons {
  width: 20px;
  height: 20px;
}

.edit,
.delete {
  color: var(--daccent);
}

.edit,
.delete:hover {
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit:hover {
  color: #01974c;
}

.delete:hover {
  color: red;
}

.btn-add-chapters {
  margin: 0 0 14px 10px;
}

.btn-add-chapters,
.add {
  color: var(--laccent);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add-chapters:hover,
.add:hover,
.btn-add-section:hover {
  background-color: var(--baccent);
  color: var(--laccent);
}

.btn-add-section {
  border-top: var(--baccent) solid 1px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add-section p {
  display: block;
  font-size: 14px;
  color: var(--laccent);
  font-weight: 600;
  margin: 10px 0;
}

.save {
  display: flex;
  flex-direction: row-reverse;
  margin: 10px;
}

.btn-save {
  font-size: 14px;
  border: var(--laccent) solid 1px;
}

.btn-save:hover {
  border: var(--laccent) solid 1px;
}

.form {
  margin: 10px;
}

.input-group,
.input-group-img {
  margin-bottom: 1em;
  display: flex;
  width: 95%;
}

.input-group {
  flex-direction: column;
}

.input-group-img {
  flex-direction: row;
  gap: 10px;
}

label {
  font-weight: 600;
  font-size: 14px;
  color: var(--daccent);
  margin: 3px 0;
}

input,
textarea {
  padding: 13px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
}

textarea {
  height: 250px;
}

input:disabled {
  background-color: #f2f2f2;
}

.course-content-header {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
}

.collapsible-btn {
  display: none;
}

@media (max-width: 992px) {
  .course-layout {
    width: 100%;
  }

  .left-panel {
    height: 100%;
  }
}

@media (max-width: 768px) {
  .header {
    display: none;
  }

  .course-layout {
    flex-direction: column;
  }

  .right-panel {
    width: 100%;
  }

  .left-panel {
    height: 100%;
    min-height: auto;
    width: 100%;

  }

  .course-content.hidden {
    display: none;
  }

  .collapsible-btn {
    display: block;
    border: 1px solid var(--laccent);
    background-color: var(--background);
    border-radius: 20px;
    padding: 7px;
    cursor: pointer;
  }

  .collapsible-btn:hover {
    border: 1px solid var(--daccent);
    background-color: var(--baccent);
    transition: transform 0.4s cubic-bezier(0.2, 0, 0.38, 0.9);
  }

  .btn {
    flex-direction: column;
  }
}

/* .btn-center {
  margin: auto;
}

.button-container {
  display: flex;
  flex-direction: column;
}

.btn-selection {
  display: flex;
  justify-content: center;
}

.btn-plus-minus {
  cursor: pointer;
  font-size: 40px;
  border: none;
  background-color: transparent;
} */
</style>
