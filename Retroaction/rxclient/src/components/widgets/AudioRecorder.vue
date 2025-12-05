<script lang="ts" setup>
import { useAudioRecorder } from '@/composables/useAudioRecorder';

const { startRecording, stopRecording, cancelRecording, isRecording } =
  useAudioRecorder(processAudio);
const emit = defineEmits<{
  (e: 'audioAvailable', audio: Blob): void;
}>();

function processAudio(audioBlob: Blob | null) {
  if (audioBlob) {
    emit('audioAvailable', audioBlob);
    /*const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recording.mp3'; // Customize the file name and format
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);*/
  }
}
</script>

<template>
  <div>Audio</div>
  <div>
    <button @click="startRecording" :disabled="isRecording">Start</button>
    <button @click="stopRecording" :disabled="!isRecording">Stop</button>
    <button @click="cancelRecording" :disabled="!isRecording">Cancel</button>
  </div>
</template>

<style scoped>
/* Add styles if needed */
</style>
