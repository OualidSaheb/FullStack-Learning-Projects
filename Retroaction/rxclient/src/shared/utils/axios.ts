import axios, { type AxiosInstance } from 'axios';
import { useAuthStore } from '@/shared/stores';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
export const api = axios.create({ baseURL: 'http://localhost:3000/api' }); // 'http://localhost:3000/api'  'https://retroaction.net/api'

api.interceptors.request.use((request) => {
  const token = localStorage.getItem('token');
  if (token) {
    if (request.headers) request.headers['Authorization'] = `Bearer ${token}`;
    else console.log('no request headers');
  }
  return request;
});

// api.interceptors.response.use((res) => {
//   if (res.data.error) {
//     console.error(res.data.error);
//     const mainStore = useMainStore();
//     mainStore.errors.push(res.data.error);
//   } else {
//     return res;
//   }
// });

api.interceptors.response.use(
  (res: any) => {
    if (res.data.error) {
      if (res.data.message && res.data.message.includes('403')) {
        //useAuthStore().logout();
      }
      //TODO : Afficher le message à l'écran ici !
      //const mainStore = useMainStore();
      //mainStore.errors.push(res.data.error);
      return res;
    }

    return res;
  },
  (error: any) => {
    if (error.code === 'ERR_NETWORK') {
      console.log('Le serveur semble fermé !');
      //TODO : Afficher le message à l'écran ici !
      /*       useMainStore().errors.push(
        "Le serveur ne répond pas.  Veuillez recommencer dans quelques minutes. Si le problème persiste, informez votre administrateur."
      ); */
      return;
    }
    if (error.message.includes('403')) {
      useAuthStore().logout();
      //TODO : Afficher le message à l'écran ici !
      /*       const mainStore = useMainStore();
      mainStore.errors.push(error.message); */
      return;
    }
    /*     const mainStore = useMainStore();
    mainStore.errors.push(error.response.data.error); */
  }
);

export default ({ app }: { app: any }): void => {
  app.config.globalProperties.$axios = api;
};
