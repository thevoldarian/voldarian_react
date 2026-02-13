import { describe, it, expect } from 'vitest';
import { maskEmail, maskPhone, formatCurrency, formatDate } from '../../src/utils/employeeUtils';

describe('employeeUtils', () => {
  describe('maskEmail', () => {
    it('masks email correctly', () => {
      expect(maskEmail('john.doe@company.com')).toBe('jo***@company.com');
    });

    it('handles short email', () => {
      expect(maskEmail('a@b.com')).toBe('a***@b.com');
    });

    it('returns original if no @ symbol', () => {
      expect(maskEmail('invalid')).toBe('invalid');
    });
  });

  describe('maskPhone', () => {
    it('masks phone correctly', () => {
      expect(maskPhone('555-123-4567')).toBe('***-***-4567');
    });

    it('handles phone without dashes', () => {
      expect(maskPhone('5551234567')).toBe('***-***-4567');
    });

    it('returns original if not 10 digits', () => {
      expect(maskPhone('123')).toBe('123');
    });
  });

  describe('formatCurrency', () => {
    it('formats currency correctly', () => {
      expect(formatCurrency(95000)).toBe('$95,000');
    });

    it('handles zero', () => {
      expect(formatCurrency(0)).toBe('$0');
    });

    it('handles large numbers', () => {
      expect(formatCurrency(1234567)).toBe('$1,234,567');
    });
  });

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const result = formatDate('2020-01-15');
      expect(result).toMatch(/Jan 1[45], 2020/);
    });

    it('handles different date format', () => {
      const result = formatDate('2021-12-25');
      expect(result).toMatch(/Dec 2[45], 2021/);
    });
  });
});
