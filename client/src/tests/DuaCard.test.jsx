import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DuaCard from '../features/duas/DuaCard';

describe('DuaCard Component', () => {
  const mockDua = {
    _id: '123',
    title: 'Test Dua',
    category: 'Morning',
    arabicText: 'اللهم بك أصبحنا',
    translation: 'O Allah, by You we enter the morning',
    transliteration: 'Allahumma bika asbahna'
  };

  it('renders the Dua title and category', () => {
    render(<DuaCard dua={mockDua} onEdit={vi.fn()} onDelete={vi.fn()} onComplete={vi.fn()} />);
    
    expect(screen.getByText('Test Dua')).toBeInTheDocument();
    expect(screen.getByText('Morning')).toBeInTheDocument();
  });

  it('renders the Arabic text correctly (RTL)', () => {
    render(<DuaCard dua={mockDua} onEdit={vi.fn()} onDelete={vi.fn()} onComplete={vi.fn()} />);
    
    const arabicElement = screen.getByText('اللهم بك أصبحنا');
    expect(arabicElement).toBeInTheDocument();
    expect(arabicElement).toHaveAttribute('dir', 'rtl');
  });

  it('calls onComplete when the "Mark as Done Today" button is clicked', () => {
    const onCompleteMock = vi.fn();
    render(<DuaCard dua={mockDua} onEdit={vi.fn()} onDelete={vi.fn()} onComplete={onCompleteMock} />);
    
    const completeButton = screen.getByText('Mark as Done Today');
    fireEvent.click(completeButton);
    
    expect(onCompleteMock).toHaveBeenCalledTimes(1);
    expect(onCompleteMock).toHaveBeenCalledWith('123');
  });
});
