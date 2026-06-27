import test from 'node:test';
import assert from 'node:assert';
import { determineState, STATES } from '../core/stateEvaluator.js';

// Helper to mock the Playwright page object
const mockPage = ({ url = '', visibleSelectors = [] }) => {
  const visibleSet = new Set(visibleSelectors);
  return {
    url: () => url,
    locator: (selector) => {
      // Split selectors in case of complex lists
      const selectors = selector.split(',').map(s => s.trim());
      const isVisibleVal = selectors.some(s => visibleSet.has(s) || visibleSet.has(`text="${s.replace(/text="/g, '').slice(0, -1)}"`));
      return {
        count: async () => isVisibleVal ? 1 : 0,
        nth: () => ({
          isVisible: async () => isVisibleVal
        }),
        first: () => ({
          isVisible: async () => isVisibleVal
        })
      };
    }
  };
};

test('State Machine Evaluation Tests', async () => {
  await test('should identify DASHBOARD state from URL', async () => {
    const page = mockPage({ url: 'https://eportal.incometax.gov.in/iec/fo/dashboard' });
    const state = await determineState(page);
    assert.strictEqual(state, STATES.DASHBOARD);
  });

  await test('should identify SUCCESS state based on success text', async () => {
    const page = mockPage({ 
      url: 'https://eportal.incometax.gov.in/iec/fo/register',
      visibleSelectors: ['text="registered successfully"'] 
    });
    const state = await determineState(page);
    assert.strictEqual(state, STATES.SUCCESS);
  });

  await test('should identify REG_OTP state based on global OTP selector', async () => {
    const page = mockPage({ 
      url: 'https://eportal.incometax.gov.in/iec/fo/register',
      visibleSelectors: ['.otp-input', 'input[autocomplete="one-time-code"]'] 
    });
    const state = await determineState(page);
    assert.strictEqual(state, STATES.REG_OTP);
  });

  await test('should identify LOGIN_PASSWORD_PAGE state', async () => {
    const page = mockPage({ 
      url: 'https://eportal.incometax.gov.in/#/login/password',
    });
    const state = await determineState(page);
    assert.strictEqual(state, STATES.LOGIN_PASSWORD_PAGE);
  });

  await test('should identify FORGOT_PASSWORD_PAN state', async () => {
    const page = mockPage({ 
      url: 'https://eportal.incometax.gov.in/#/forgot-password',
      visibleSelectors: ['[class*="forgot"]', 'input[formcontrolname*="pan" i]']
    });
    const state = await determineState(page);
    assert.strictEqual(state, STATES.FORGOT_PASSWORD_PAN);
  });
});
