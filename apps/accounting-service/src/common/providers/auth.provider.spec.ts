import { AuthProvider } from './';

describe('AuthProvider', () => {
  let provider: AuthProvider;
  let password: string;
  let hash: string;

  beforeAll(() => {
    provider = new AuthProvider();
    password = 'passwordTest';
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('hashPassword', async () => {
    const hashedPassword = await provider.hashPassword(password);
    expect(typeof hashedPassword).toBe('string');
    expect(hashedPassword.length).toBeGreaterThan(0);
    hash = hashedPassword;
  });
  it('hashPassword', async () => {
    const match = await provider.comparePasswords(password, hash);
    expect(match).toBeTruthy();
  });
});
