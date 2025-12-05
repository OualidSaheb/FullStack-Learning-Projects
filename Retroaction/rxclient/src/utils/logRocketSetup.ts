//@ts-ignore
import LogRocket from "logrocket";

export const initializeLogRocket = (username :string, email : string) => {
  LogRocket.init('dokrwi/rxaction');
  LogRocket.identify('USER_ID', {
    name: username,
    email: email,
  });
};