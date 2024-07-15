export async function hashPassword(password: string): Promise<string> {
  const arrayBuffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(password)
  );

  return Buffer.from(arrayBuffer).toString('base64');
}
