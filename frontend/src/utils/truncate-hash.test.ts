import { truncateHash } from './truncate-hash';

describe('truncateHash', () => {
  it('should truncate hash', () => {
    const mockBlockHash =
      '05ebc114e9c28b22dc9830b561b02569642698358a100b4c0f1123766d3a73bd';

    const truncatedHash = truncateHash(mockBlockHash);

    expect(truncatedHash).toBe('05ebc...a73bd');
  });

  it('should throw when passed a string less than 11 chars', () => {
    const mockBlockHash = 'short-hash';

    expect.assertions(1);

    const errFn = () => truncateHash(mockBlockHash);
    expect(errFn).toThrow(`Hash too short: ${mockBlockHash}`);
  });
});

export {};
