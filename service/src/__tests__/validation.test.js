import test from 'node:test';
import assert from 'node:assert';

// Define a simple validator function matching orchestratorController.js logic
const validatePan = (pan) => {
  if (!pan) return { error: 'PAN is required' };
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
  if (!panRegex.test(pan)) {
    return { error: 'Invalid PAN format' };
  }
  return null;
};

test('PAN Validation Tests', () => {
  test('should fail when PAN is missing', () => {
    const res = validatePan(undefined);
    assert.deepStrictEqual(res, { error: 'PAN is required' });
  });

  test('should fail when PAN format is invalid', () => {
    const badPans = [
      'ABC1234F',      // short
      'ABCDE1234',      // missing trailing letter
      '12345ABCDE',     // wrong order
      'ABCDE12345F',    // extra digit
      'ABCDE1234FG',    // extra letter
    ];
    for (const bad of badPans) {
      const res = validatePan(bad);
      assert.deepStrictEqual(res, { error: 'Invalid PAN format' });
    }
  });

  test('should pass when PAN format is valid', () => {
    const goodPans = [
      'ABCDE1234F',
      'abcde1234f', // case-insensitive
      'XYZAB9999Z',
    ];
    for (const good of goodPans) {
      const res = validatePan(good);
      assert.strictEqual(res, null);
    }
  });
});
