import { hashPassword } from './hash-password';

export async function validatePassword(
  userPassword: string,
  originalHashedPassword: string
): Promise<boolean> {
  return (await hashPassword(userPassword)) === originalHashedPassword;
}
