import { bigIntTransformer } from './';

describe('Transformer', () => {
  it('should be defined', () => {
    expect(bigIntTransformer).toBeDefined();
  });

  it('bigIntTransformer to', async () => {
    const value = await bigIntTransformer.to(new Date().getTime());
    expect(typeof value).toBe('number');
    expect(value).toBeGreaterThan(0);
  });

  it('bigIntTransformer from', async () => {
    const value = await bigIntTransformer.from(new Date().getTime().toString());
    expect(typeof value).toBe('number');
    expect(value).toBeGreaterThan(0);
  });
});
