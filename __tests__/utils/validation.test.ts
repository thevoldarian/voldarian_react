import { describe, it, expect } from 'vitest';
import { validateGitHubUsername, sanitizeGitHubUsername } from '../../src/utils/validation';

describe('validateGitHubUsername', () => {
  it('validates correct usernames', () => {
    expect(validateGitHubUsername('thevoldarian').valid).toBe(true);
    expect(validateGitHubUsername('user-name').valid).toBe(true);
    expect(validateGitHubUsername('user123').valid).toBe(true);
  });

  it('rejects empty username', () => {
    const result = validateGitHubUsername('');
    expect(result.valid).toBe(false);
    expect(result.errorKey).toBe('validation.usernameRequired');
  });

  it('rejects username over 39 characters', () => {
    const result = validateGitHubUsername('a'.repeat(40));
    expect(result.valid).toBe(false);
    expect(result.errorKey).toBe('validation.usernameTooLong');
  });

  it('rejects username starting with hyphen', () => {
    const result = validateGitHubUsername('-username');
    expect(result.valid).toBe(false);
  });

  it('rejects username ending with hyphen', () => {
    const result = validateGitHubUsername('username-');
    expect(result.valid).toBe(false);
  });

  it('rejects consecutive hyphens', () => {
    const result = validateGitHubUsername('user--name');
    expect(result.valid).toBe(false);
    expect(result.errorKey).toBe('validation.usernameConsecutiveHyphens');
  });

  it('rejects special characters', () => {
    const result = validateGitHubUsername('user@name');
    expect(result.valid).toBe(false);
  });
});

describe('sanitizeGitHubUsername', () => {
  it('trims and lowercases username', () => {
    expect(sanitizeGitHubUsername('  UserName  ')).toBe('username');
    expect(sanitizeGitHubUsername('UPPERCASE')).toBe('uppercase');
  });
});
