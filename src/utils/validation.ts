// GitHub username rules:
// - May only contain alphanumeric characters or hyphens
// - Cannot have multiple consecutive hyphens
// - Cannot begin or end with a hyphen
// - Maximum 39 characters

const GITHUB_USERNAME_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

export const VALIDATION_ERRORS = {
  REQUIRED: 'validation.usernameRequired',
  TOO_LONG: 'validation.usernameTooLong',
  INVALID_FORMAT: 'validation.usernameInvalidFormat',
  CONSECUTIVE_HYPHENS: 'validation.usernameConsecutiveHyphens',
} as const;

export const validateGitHubUsername = (username: string): { valid: boolean; errorKey?: string } => {
  if (!username || username.trim().length === 0) {
    return { valid: false, errorKey: VALIDATION_ERRORS.REQUIRED };
  }

  if (username.length > 39) {
    return { valid: false, errorKey: VALIDATION_ERRORS.TOO_LONG };
  }

  if (!GITHUB_USERNAME_REGEX.test(username)) {
    return { valid: false, errorKey: VALIDATION_ERRORS.INVALID_FORMAT };
  }

  if (username.includes('--')) {
    return { valid: false, errorKey: VALIDATION_ERRORS.CONSECUTIVE_HYPHENS };
  }

  return { valid: true };
};

export const sanitizeGitHubUsername = (username: string): string => {
  return username.trim().toLowerCase();
};
