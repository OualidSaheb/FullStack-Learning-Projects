<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCourseTestStore } from '@/stores/courseReaderStore';
import { useRoute } from 'vue-router';
import Button from '@/components/Widgets/ButtonComp.vue';


const route = useRoute()
const store = useCourseTestStore();
let courseId = Number(route.params.id);

const selectedCourse = store.getCourseById(courseId);

const userAnswers = ref<Record<number, number>>({});
const isExamCompleted = ref(false);

const examScore = computed(() => {
    if (!selectedCourse?.exam) return 0;

    let totalScore = 0;
    selectedCourse.exam.questions.forEach((question) => {
        const answerIndex = userAnswers.value[question.id];
        if (typeof answerIndex !== 'undefined') {
            const answerWeight = question.answers[answerIndex].weight;
            totalScore += (answerWeight / 100) * question.weight;
        }
    });
    return totalScore;
});

const countdown = ref(3); // 3 seconds countdown
const showCountdown = ref(false);

const startCountdown = () => {
    const interval = setInterval(() => {
        if (countdown.value > 0) {
            countdown.value--;
        } else {
            clearInterval(interval);
            showCountdown.value = false;
            isExamCompleted.value = true;
        }
    }, 1000);
}


const submitExam = () => {
    isExamCompleted.value = true;
    store.submitExamAnswers(courseId, new Map(Object.entries(userAnswers.value).map(([key, value]) => [Number(key), value])));
    // Start countdown after submitting the exam
    showCountdown.value = true;
    startCountdown();
};

const correctAnswers = computed(() => {
    const correct: Record<number, number> = {};
    selectedCourse?.exam?.questions.forEach((question: any) => {
        correct[question.id] = question.answers.findIndex((answer: any) => answer.weight > 0);
    });
    return correct;
});


</script>

<template>
    <div class="exam-container">
        <div v-if="selectedCourse && selectedCourse.exam">
            <div v-if="!isExamCompleted">
                <!-- <h2>{{ selectedCourse.exam.name }}</h2> -->
                <form @submit.prevent="submitExam">
                    <div class="questions" v-for="question in selectedCourse.exam.questions" :key="question.id">
                        <p class="question">{{ question.id }} - {{ question.questionText }}</p>
                        <div v-for="(answer, index) in question.answers" :key="index" class="radio-button-container">
                            <label class="radio-button">
                                <input type="radio" :name="`question-${question.id}`" :value="index"
                                    v-model="userAnswers[question.id]" class="radio-button__input" />
                                <span class="radio-button__label">
                                    <span class="radio-button__custom"></span>
                                    {{ answer.answerText }}
                                </span>
                            </label>
                        </div>
                    </div>
                    <Button type="submit" class="btn-save" btnText="Envoyer" btnColor="var(--textlight)"
                        btnBgColor="var(--laccent)" btnHoverColor="var(--laccent)" btnHoverBgColor="var(--textlight)" />
                </form>
            </div>

            <!-- Countdown Display -->
            <div v-if="showCountdown" class="countdown-container">
                <p class="countdown"> {{ countdown }}</p>
            </div>

            <transition name="fade-slide">
                <div v-if="isExamCompleted && !showCountdown">
                    <h3>Votre Note: {{ examScore }}%</h3>

                    <div class="questions" v-for="question in selectedCourse.exam.questions" :key="question.id">
                        <p class="question">{{ question.id }} - {{ question.questionText }}</p>

                        <div v-for="(answer, index) in question.answers" :key="index" class="radio-button-container">
                            <label class="radio-button">
                                <input type="radio" :name="`question-${question.id}`" :value="index"
                                    v-model="userAnswers[question.id]" class="radio-button__input" disabled />
                                <span class="radio-button__label">
                                    <span class="radio-button__custom"></span>
                                    {{ answer.answerText }}
                                    <!-- Display checkmark or X based on the user's answer -->
                                    <span v-if="userAnswers[question.id] == index"
                                        :class="userAnswers[question.id] == correctAnswers[question.id] ? 'correct-answer' : 'wrong-answer'"></span>
                                </span>
                            </label>
                        </div>

                        <!-- Display correct answer if user's answer was wrong -->
                        <div v-if="userAnswers[question.id] != correctAnswers[question.id]" class="correct-answer-text">
                            La bonne réponse est : {{ question.answers[correctAnswers[question.id]].answerText }}
                        </div>
                    </div>
                </div>
            </transition>


        </div>
        <div v-else>
            <p>Pas d'examen</p>
        </div>
    </div>
</template>

<style scoped>
.exam-container {
    margin: 25px 0;
}

.questions {
    margin: 10px 0;
    /* border-bottom: var(--baccent) solid 1px; */
    padding: 0 0 10px 0
}

.question {
    font-weight: 600;
    font-size: 14px;
    margin: 10px 0;
}

.answer {
    font-size: 14px;
    color: var(--daccent);

}

h2 {
    margin: 5px 0;
    font-size: 16px;
    font-weight: 600;
}

.btn-save {
    font-size: 14px;
    border: var(--laccent) solid 1px;
    margin: 15px 0;
}

.btn-save:hover {
    border: var(--laccent) solid 1px;
    transform: scale(1);
}

.countdown-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.countdown {
    font-size: 30px;
    font-weight: 300;
    text-align: center;
    padding: 10px;
    border: var(--baccent) solid 5px;
    transition: all 0.3s ease;
}

.radio-button-container {
    display: flex;
    align-items: center;
    gap: 24px;
}

.radio-button {
    display: inline-block;
    position: relative;
    cursor: pointer;
}

.radio-button__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.radio-button__label {
    display: inline-block;
    padding-left: 30px;
    margin-bottom: 10px;
    margin: 3px 0px 3px 15px;
    position: relative;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.3s ease;
}

.radio-button__custom {
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #555;
    transition: all 0.3s ease;
}

.radio-button__input:checked+.radio-button__label .radio-button__custom {
    background-color: var(--laccent);
    border-color: transparent;
    transform: scale(0.8);
    box-shadow: 0 0 20px #b74cf580;
}

.radio-button__input:checked+.radio-button__label {
    color: var(--laccent);
}

.radio-button__label:hover .radio-button__custom {
    transform: scale(1.2);
    border-color: var(--laccent);
    box-shadow: 0 0 20px #b74cf580;
}


.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity 1s, transform 1s;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
    opacity: 1;
    transform: translateY(0);
}





h3 {
    color: var(--laccent);
    margin: 20px 0;
    font-size: 20px;
    font-weight: 600;
}

.correct-answer::after {
    content: '✔';
    color: green;
    font-size: 16px;
    margin-left: 10px;
}

.wrong-answer::after {
    content: '✖';
    color: red;
    font-size: 16px;
    margin-left: 10px;
}

.correct-answer-text {
    color: red;
    padding: 5px;
    font-size: 14px;
    font-weight: 600;
    margin: 3px 0px 3px 15px;
}
</style>
