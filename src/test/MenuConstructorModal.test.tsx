import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MenuConstructorModal } from '@/components/MenuConstructorModal';
import type { MenuTemplate } from '@/types';

// Monaco is aliased to src/test/mocks/monaco.ts in vite.config.ts test.alias
// so the real Monaco DOM APIs are never invoked in jsdom.

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  onInsert: vi.fn(),
  labels: new Set(['scene_one', 'scene_two']),
  variables: new Set(['score', 'player_name']),
  mode: 'create' as const,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('MenuConstructorModal', () => {
  describe('visibility', () => {
    it('renders nothing when isOpen is false', () => {
      const { container } = render(<MenuConstructorModal {...defaultProps} isOpen={false} />);
      expect(container).toBeEmptyDOMElement();
      expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('renders the dialog when isOpen is true', () => {
      render(<MenuConstructorModal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('shows "Create Menu" title in create mode', () => {
      render(<MenuConstructorModal {...defaultProps} />);
      expect(screen.getByText('Create Menu')).toBeInTheDocument();
    });

    it('shows "Edit Menu Template" title in edit-template mode', () => {
      render(<MenuConstructorModal {...defaultProps} mode="edit-template" />);
      expect(screen.getByText('Edit Menu Template')).toBeInTheDocument();
    });
  });

  describe('initial state', () => {
    it('starts with two empty choice rows', () => {
      render(<MenuConstructorModal {...defaultProps} />);
      // Each choice row has a "Choice text" placeholder input
      const choiceInputs = screen.getAllByPlaceholderText(/choice text/i);
      expect(choiceInputs).toHaveLength(2);
    });

    it('populates from initialTemplate when provided', () => {
      const template: MenuTemplate = {
        id: 'tpl-1',
        name: 'My Template',
        description: 'A test template',
        menuStatement: 'What do you do?',
        choices: [
          { id: 'c1', text: 'Go left', action: 'jump', target: 'scene_one' },
          { id: 'c2', text: 'Go right', action: 'jump', target: 'scene_two' },
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      render(<MenuConstructorModal {...defaultProps} initialTemplate={template} mode="edit-template" />);
      expect(screen.getByDisplayValue('What do you do?')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Go left')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Go right')).toBeInTheDocument();
    });
  });

  describe('choice management', () => {
    it('adds a choice when "Add Choice" is clicked', () => {
      render(<MenuConstructorModal {...defaultProps} />);
      const addBtn = screen.getByRole('button', { name: /add choice/i });
      fireEvent.click(addBtn);
      const choiceInputs = screen.getAllByPlaceholderText(/choice text/i);
      expect(choiceInputs).toHaveLength(3);
    });

    it('removes a choice when the remove button is clicked', () => {
      render(<MenuConstructorModal {...defaultProps} />);
      // Add a third choice first so we can remove one safely (min is 1)
      const addBtn = screen.getByRole('button', { name: /add choice/i });
      fireEvent.click(addBtn);
      expect(screen.getAllByPlaceholderText(/choice text/i)).toHaveLength(3);

      const removeButtons = screen.getAllByLabelText(/remove choice/i);
      fireEvent.click(removeButtons[0]);
      expect(screen.getAllByPlaceholderText(/choice text/i)).toHaveLength(2);
    });

    it('does not remove a choice when only one remains', () => {
      render(<MenuConstructorModal {...defaultProps} />);
      // Remove until only 1 remains
      let removeButtons = screen.getAllByLabelText(/remove choice/i);
      fireEvent.click(removeButtons[0]);
      // Only one choice left — clicking remove should do nothing
      removeButtons = screen.getAllByLabelText(/remove choice/i);
      fireEvent.click(removeButtons[0]);
      expect(screen.getAllByPlaceholderText(/choice text/i)).toHaveLength(1);
    });
  });

  describe('validation', () => {
    it('Insert button is disabled when all choices are empty', () => {
      render(<MenuConstructorModal {...defaultProps} />);
      const insertBtn = screen.getByRole('button', { name: /insert/i });
      expect(insertBtn).toBeDisabled();
    });

    it('Insert button is disabled when jump choice is missing target', () => {
      render(<MenuConstructorModal {...defaultProps} />);
      const choiceInputs = screen.getAllByPlaceholderText(/choice text/i);
      fireEvent.change(choiceInputs[0], { target: { value: 'Go somewhere' } });
      // action defaults to 'jump', target is empty → invalid
      const insertBtn = screen.getByRole('button', { name: /insert/i });
      expect(insertBtn).toBeDisabled();
    });

    it('Insert button is enabled when a jump choice has text and target', () => {
      render(<MenuConstructorModal {...defaultProps} />);
      const choiceInputs = screen.getAllByPlaceholderText(/choice text/i);
      fireEvent.change(choiceInputs[0], { target: { value: 'Go north' } });

      // Enter a jump target
      const targetInputs = screen.getAllByPlaceholderText(/label name/i);
      fireEvent.change(targetInputs[0], { target: { value: 'scene_one' } });

      const insertBtn = screen.getByRole('button', { name: /insert/i });
      expect(insertBtn).not.toBeDisabled();
    });
  });

  describe('onInsert callback', () => {
    it('calls onInsert with generated Ren\'Py code and closes modal', () => {
      render(<MenuConstructorModal {...defaultProps} />);

      const choiceInputs = screen.getAllByPlaceholderText(/choice text/i);
      fireEvent.change(choiceInputs[0], { target: { value: 'Go north' } });

      const targetInputs = screen.getAllByPlaceholderText(/label name/i);
      fireEvent.change(targetInputs[0], { target: { value: 'scene_one' } });

      const insertBtn = screen.getByRole('button', { name: /insert/i });
      fireEvent.click(insertBtn);

      expect(defaultProps.onInsert).toHaveBeenCalledOnce();
      const [code] = defaultProps.onInsert.mock.calls[0];
      expect(code).toContain('menu:');
      expect(code).toContain('"Go north"');
      expect(code).toContain('jump scene_one');
      expect(defaultProps.onClose).toHaveBeenCalledOnce();
    });

    it('includes menuStatement in generated code when provided', () => {
      render(<MenuConstructorModal {...defaultProps} />);

      fireEvent.change(screen.getByPlaceholderText(/what will you do\?/i), {
        target: { value: 'Where will you go?' },
      });

      const choiceInputs = screen.getAllByPlaceholderText(/choice text/i);
      fireEvent.change(choiceInputs[0], { target: { value: 'North' } });
      const targetInputs = screen.getAllByPlaceholderText(/label name/i);
      fireEvent.change(targetInputs[0], { target: { value: 'scene_one' } });

      fireEvent.click(screen.getByRole('button', { name: /insert/i }));

      const [code] = defaultProps.onInsert.mock.calls[0];
      expect(code).toContain('menu "Where will you go?":');
    });

    it('passes templateData when saveAsTemplate is checked', () => {
      render(<MenuConstructorModal {...defaultProps} />);

      // Enable save-as-template (checkbox is inside a <label> with text "Save as Template")
      const templateCheckbox = screen.getByRole('checkbox');
      fireEvent.click(templateCheckbox);

      // Fill template name
      const nameInput = screen.getByPlaceholderText(/^Template name$/i);
      fireEvent.change(nameInput, { target: { value: 'My Template' } });

      // Fill a valid choice
      const choiceInputs = screen.getAllByPlaceholderText(/choice text/i);
      fireEvent.change(choiceInputs[0], { target: { value: 'Option A' } });
      const targetInputs = screen.getAllByPlaceholderText(/label name/i);
      fireEvent.change(targetInputs[0], { target: { value: 'scene_one' } });

      fireEvent.click(screen.getByRole('button', { name: /insert/i }));

      const [, templateData] = defaultProps.onInsert.mock.calls[0];
      expect(templateData).toBeDefined();
      expect(templateData.name).toBe('My Template');
      expect(templateData.choices).toHaveLength(1);
      expect(templateData.choices[0].text).toBe('Option A');
    });
  });

  describe('cancel / close', () => {
    it('calls onClose when Cancel is clicked', () => {
      render(<MenuConstructorModal {...defaultProps} />);
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(defaultProps.onClose).toHaveBeenCalledOnce();
    });

    it('calls onClose when the × button is clicked', () => {
      render(<MenuConstructorModal {...defaultProps} />);
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      expect(defaultProps.onClose).toHaveBeenCalledOnce();
    });
  });
});
