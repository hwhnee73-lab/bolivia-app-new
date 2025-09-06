import React from 'react';
import { render } from '@testing-library/react';
import { AppProvider } from './contexts/AppContext';

export const renderWithProvider = (ui, options) => {
  return render(<AppProvider>{ui}</AppProvider>, options);
};

export const mockFetch = (json, ok = true, status = 200) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status,
    json: async () => json,
  });
};

export const restoreFetch = () => {
  if (global.fetch && 'mockClear' in global.fetch) {
    global.fetch.mockClear();
  }
};

