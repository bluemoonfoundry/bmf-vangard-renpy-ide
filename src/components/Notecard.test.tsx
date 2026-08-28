import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Notecard from '@/components/Notecard';
import { createNotecard } from '@/test/mocks/sampleData';

describe('Notecard', () => {
  it('renders title and enters edit mode on double-click, saving on blur', () => {
    const card = createNotecard({ title: 'Plot Beat', content: 'She discovers the letter.' });
    const updateCard = vi.fn();
    render(
      <Notecard card={card} updateCard={updateCard} deleteCard={vi.fn()} isSelected={false} isDragging={false} onStartLinkDrag={vi.fn()} />
    );
    expect(screen.getByText('Plot Beat')).toBeInTheDocument();
    fireEvent.doubleClick(screen.getByText('Plot Beat'));
    const titleInput = screen.getByDisplayValue('Plot Beat');
    fireEvent.change(titleInput, { target: { value: 'Renamed Beat' } });
    fireEvent.blur(titleInput);
    expect(updateCard).toHaveBeenCalledWith(card.id, { title: 'Renamed Beat' });
  });

  it('calls deleteCard when the delete button is clicked', () => {
    const card = createNotecard();
    const deleteCard = vi.fn();
    render(
      <Notecard card={card} updateCard={vi.fn()} deleteCard={deleteCard} isSelected={false} isDragging={false} onStartLinkDrag={vi.fn()} />
    );
    fireEvent.click(screen.getByLabelText('Delete notecard'));
    expect(deleteCard).toHaveBeenCalledWith(card.id);
  });

  it('opens the color popover and calls updateCard with the chosen color', () => {
    const card = createNotecard({ color: 'yellow' });
    const updateCard = vi.fn();
    render(
      <Notecard card={card} updateCard={updateCard} deleteCard={vi.fn()} isSelected={false} isDragging={false} onStartLinkDrag={vi.fn()} />
    );
    fireEvent.click(screen.getByLabelText('Change notecard color'));
    fireEvent.click(screen.getByLabelText('Blue'));
    expect(updateCard).toHaveBeenCalledWith(card.id, { color: 'blue' });
  });

  it('renders a resize handle and a link handle', () => {
    const card = createNotecard();
    const { container } = render(
      <Notecard card={card} updateCard={vi.fn()} deleteCard={vi.fn()} isSelected={false} isDragging={false} onStartLinkDrag={vi.fn()} />
    );
    expect(container.querySelector('.resize-handle')).toBeTruthy();
    expect(container.querySelector('.link-handle')).toBeTruthy();
  });
});
