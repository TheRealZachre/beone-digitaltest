export function getAuthSecret(): string | undefined {
  return process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
}

export async function getAuthUrl(): Promise<string | undefined> {
  return process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
}

export function isAuthSecretConfigured(): boolean {
  return Boolean(getAuthSecret());
}
