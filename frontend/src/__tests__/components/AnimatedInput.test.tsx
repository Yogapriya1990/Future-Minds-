import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AnimatedInput } from '../../components/ui/AnimatedInput';

describe('AnimatedInput', () => {
  it('renders label', () => {
    render(<AnimatedInput label="Email" value="" onChange={vi.fn()} />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders input with value', () => {
    render(<AnimatedInput label="Name" value="Alice" onChange={vi.fn()} />);
    expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();
  });

  it('calls onChange on input', () => {
    const handler = vi.fn();
    render(<AnimatedInput label="Search" value="" onChange={handler} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
    expect(handler).toHaveBeenCalled();
  });

  it('shows error message', () => {
    render(<AnimatedInput label="Email" value="" onChange={vi.fn()} error="Required field" />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('is disabled when prop is set', () => {
    render(<AnimatedInput label="Read Only" value="fixed" onChange={vi.fn()} disabled />);
    expect(screen.getByDisplayValue('fixed')).toBeDisabled();
  });
});
