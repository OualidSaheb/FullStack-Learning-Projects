<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

import Button from '@/components/Widgets/ButtonComp.vue'

const emit = defineEmits(['video-recorded', 'audio-level-updated'])
let videoElement = ref<HTMLVideoElement | null>(null)
let mediaRecorder: MediaRecorder | null = null
let chunks: BlobPart[] = []

const startRecording = async () => {
  if (audioContext.state === 'suspended') {
    await audioContext.resume()
  }
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  videoElement.value!.srcObject = stream
  mediaRecorder = new MediaRecorder(stream)

  const audioSource = audioContext.createMediaStreamSource(stream)
  audioSource.connect(analyser)
  updateAudioLevel()
  mediaRecorder.ondataavailable = function (e) {
    chunks.push(e.data)
  }

  mediaRecorder.onstop = function () {
    const blob = new Blob(chunks, { type: 'video/webm' })
    chunks = []

    emit('video-recorded', blob)
  }

  mediaRecorder.start()
}

const stopRecording = () => {
  mediaRecorder?.stop()
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
  }
  if (videoElement.value?.srcObject) {
    const tracks = (videoElement.value.srcObject as MediaStream).getTracks()
    tracks.forEach((track) => track.stop())
  }
}

defineExpose({
  startRecording,
  stopRecording
})

//VUE meter
const audioContext = new AudioContext()
const analyser = audioContext.createAnalyser()
const dataArray = new Uint8Array(analyser.frequencyBinCount)
const audioLevel = ref(0)
let animationId: number | null = null

const updateAudioLevel = () => {
  analyser.getByteFrequencyData(dataArray)

  let sum = 0
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i]
  }

  audioLevel.value = sum / dataArray.length

  emit('audio-level-updated', audioLevel.value)

  animationId = requestAnimationFrame(updateAudioLevel)
}

onUnmounted(() => {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
  }
  audioContext.close()
})
</script>
<template>
  <div class="videoElement-container">

    <div class="btn">
      <Button class="btn-save" btnText="Commencer l'enregistrement" btnColor="var(--textlight)"
        btnBgColor="var(--laccent)" btnHoverColor="var(--laccent)" btnHoverBgColor="var(--textlight)"
        @click="startRecording"></Button>
      <Button class="btn-save" btnText="Arrêter l'enregistrement" btnColor="var(--textlight)" btnBgColor="var(--laccent)"
        btnHoverColor="var(--laccent)" btnHoverBgColor="var(--textlight)" @click="stopRecording"></Button>
    </div>
    <video class="videoElement" ref="videoElement" autoplay playsinline></video>
  </div>
</template>
<style scoped>
.videoElement {
  width: 100%;
  height: 100%;
  border: 1px black solid;
  background-color: black;
}

.videoElement-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 10px 0;
}


.btn {
  display: flex;
  gap: 5px;
}

.btn-save {
  font-size: 14px;
  border: var(--laccent) solid 1px;
}

.btn-save:hover {
  border: var(--laccent) solid 1px;
  transform: scale(1);
}

.progress-bar {
  height: 100%;
  background-color: var(--daccent);
  transition: width 0.4s;
}

@media (max-width: 768px) {
  .btn {
    flex-direction: column;
  }
}
</style>