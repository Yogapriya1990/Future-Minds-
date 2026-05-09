import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GradientButton } from '../../components/ui/GradientButton';

describe('GradientButton', () => {
  it('renders label text', () => {
    render(<GradientButton>Click Me</GradientButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handler = vi.fn();
    render(<GradientButton onClick={handler}>Go</GradientButton>);
    fireEvent.click(screen.getByText('Go'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('shows loading spinner when isLoading', () => {
    const { container } = render(<GradientButton isLoading>Save</GradientButton>);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('is disabled when isLoading', () => {
    render(<GradientButton isLoading>Save</GradientButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders outline variant', () => {
    const { container } = render(<GradientButton variant="outline">Outline</GradientButton>);
    // outline variant uses border-2 not border
    expect(container.firstChild).toHaveClass('border-2');
  });
});
