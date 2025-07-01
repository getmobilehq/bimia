import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../LoginPage';

// Mock the useLogin hook
jest.mock('../../hooks/useAuth', () => ({
  useLogin: () => ({
    mutate: jest.fn((_, { onSuccess }) => onSuccess({ access_token: 'fake-token' })),
    isLoading: false,
  }),
}));

describe('LoginPage', () => {
  it('renders login form and submits credentials', async () => {
    const onLogin = jest.fn();
    render(<LoginPage onLogin={onLogin} />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'user@bimi.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith('fake-token');
    });
  });
});
