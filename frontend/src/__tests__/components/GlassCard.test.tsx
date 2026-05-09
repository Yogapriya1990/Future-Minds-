import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GlassCard } from '../../components/ui/GlassCard';

describe('GlassCard', () => {
  it('renders children', () => {
    render(<GlassCard>Hello World</GlassCard>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('applies extra className', () => {
    const { container } = render(<GlassCard className="my-custom-class">X</GlassCard>);
    expect(container.firstChild).toHaveClass('my-custom-class');
  });
});
