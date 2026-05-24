import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    refreshUser: vi.fn(),
  }),
}));

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe('LoginPage', () => {
  it('renders login form elements', async () => {
    const { default: LoginPage } = await import('../../pages/auth/LoginPage');
    render(<LoginPage />, { wrapper: createWrapper() });
    expect(screen.getAllByText(/sign in/i).length).toBeGreaterThan(0);
  });
});

describe('RegisterPage', () => {
  it('renders register form elements', async () => {
    const { default: RegisterPage } = await import('../../pages/auth/RegisterPage');
    render(<RegisterPage />, { wrapper: createWrapper() });
    expect(screen.getByText(/create account/i)).toBeInTheDocument();
  });
});
