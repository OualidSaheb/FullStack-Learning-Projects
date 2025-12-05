import { ref } from 'vue';

export function useAudioRecorder(callback: (audio: Blob | null) => void) {
  const isRecording = ref(false);
  const mediaRecorder = ref<MediaRecorder | null>(null);
  const audioChunks = ref<Blob[]>([]);
  const recordingTimeout = ref<number | undefined>(undefined);

  const startRecording = async (): Promise<void> => {
    if (isRecording.value) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const newMediaRecorder = new MediaRecorder(stream);
      newMediaRecorder.ondataavailable = (event: BlobEvent) => {
        audioChunks.value.push(event.data);
      };
      newMediaRecorder.start();
      recordingTimeout.value = window.setTimeout(stopRecording, 60000); // Stop recording after 60 seconds
      mediaRecorder.value = newMediaRecorder;
      isRecording.value = true;
    } catch (error) {
      console.error('Error accessing the microphone', error);
    }
  };

  const stopRecording = (): void => {
    if (!isRecording.value) return;
    window.clearTimeout(recordingTimeout.value);
    mediaRecorder.value?.stop();
    mediaRecorder.value?.addEventListener(
      'stop',
      () => {
        const audioBlob = new Blob(audioChunks.value, { type: 'audio/mpeg' });
        callback(audioBlob);
        audioChunks.value = [];
      },
      { once: true }
    );
    isRecording.value = false;
  };

  const cancelRecording = (): void => {
    if (!isRecording.value) return;
    window.clearTimeout(recordingTimeout.value);
    mediaRecorder.value?.stop();
    mediaRecorder.value?.addEventListener(
      'stop',
      () => {
        callback(null);
        audioChunks.value = [];
      },
      { once: true }
    );
    isRecording.value = false;
  };

  return { startRecording, stopRecording, cancelRecording, isRecording };
}
