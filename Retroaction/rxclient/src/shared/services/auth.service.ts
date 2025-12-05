import type { SignInFormInterface, UserFormInterface, UserInterface } from '@/shared/interfaces';
import type { AuthState } from '@/shared/stores/authStore';
import { api } from '@/shared/utils/axios';

const ROUTE_URL = '/auth';

/**
 * Création d'une authentification.
 * Attention, il n'y aura réponse ici que si l'utilisateur est authentifié.
 * Sinon, il y aura une erreur 401 trappée par l'intercepteur de réponse Axios.
 * @param loginForm Le courriel et le mot de passe de l'utilisateur
 * @returns AuthState si authentifié, null sinon
 */
export async function signIn(loginForm: SignInFormInterface): Promise<AuthState | null> {
  const response = await api.post('/auth/signin', loginForm);
  return response?.data?.result;
}

export async function updateUserPassword(
  email: string,
  newPassword: string,
  resetPassToken: string
) {
  const response = await api.patch(`${ROUTE_URL}/updatePassword`, {
    email,
    newPassword,
    resetPassToken
  });
  return response.data.result;
}

export async function sendEmailToUpdatePassword(users: UserFormInterface[]) {
  const response = await api.post(`${ROUTE_URL}/emailUpdatePassword`, { data: users });
  return response.data.result;
}

export async function resetEmailPassword(mail: string) {
  const response = await api.post(`${ROUTE_URL}/emailResetPassword`, { data: mail });

  console.log(response.data.result);

  return response.data.result;
}

export async function checkEmail(email: string) {
  const response = await api.post(`${ROUTE_URL}/resetPassword`, { email });

  let validations: boolean;

  if (response.data.result) {
    validations = true;
  } else {
    validations = false;
  }

  return validations;
}
