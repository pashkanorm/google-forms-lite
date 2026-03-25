import { render, screen, fireEvent } from '@testing-library/react';
import QuestionInput from './QuestionInput';
import { QuestionType } from '../../../shared/types';

describe('QuestionInput', () => {
  const mockProps = {
    questionId: 'q1',
    text: 'What is your name?',
    type: QuestionType.TEXT,
    value: '',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Text Input', () => {
    it('should render text input for TEXT type question', () => {
      render(<QuestionInput {...mockProps} />);

      expect(screen.getByDisplayValue('')).toBeInTheDocument();
      expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'text');
    });

    it('should display question text as label', () => {
      render(<QuestionInput {...mockProps} />);

      expect(screen.getByText('What is your name?')).toBeInTheDocument();
    });

    it('should call onChange when text input changes', () => {
      render(<QuestionInput {...mockProps} />);

      const input = screen.getByDisplayValue('') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'John Doe' } });

      expect(mockProps.onChange).toHaveBeenCalledWith('John Doe');
    });

    it('should display existing value', () => {
      render(<QuestionInput {...mockProps} value="Jane Doe" />);

      expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
    });
  });

  describe('Date Input', () => {
    it('should render date input for DATE type question', () => {
      render(<QuestionInput {...mockProps} type={QuestionType.DATE} />);

      expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'date');
    });

    it('should call onChange when date changes', () => {
      render(<QuestionInput {...mockProps} type={QuestionType.DATE} />);

      const input = screen.getByDisplayValue('') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '2026-03-24' } });

      expect(mockProps.onChange).toHaveBeenCalledWith('2026-03-24');
    });
  });

  describe('Multiple Choice', () => {
    const mcProps = {
      ...mockProps,
      type: QuestionType.MULTIPLE_CHOICE,
      options: ['Option 1', 'Option 2', 'Option 3'],
    };

    it('should render radio buttons for MULTIPLE_CHOICE type', () => {
      render(<QuestionInput {...mcProps} />);

      expect(screen.getByRole('radio', { name: 'Option 1' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Option 2' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Option 3' })).toBeInTheDocument();
    });

    it('should call onChange when radio button is selected', () => {
      render(<QuestionInput {...mcProps} />);

      const radio = screen.getByRole('radio', { name: 'Option 2' });
      fireEvent.click(radio);

      expect(mockProps.onChange).toHaveBeenCalledWith('Option 2');
    });

    it('should show selected radio button', () => {
      render(<QuestionInput {...mcProps} value="Option 2" />);

      expect(screen.getByRole('radio', { name: 'Option 2' })).toBeChecked();
      expect(screen.getByRole('radio', { name: 'Option 1' })).not.toBeChecked();
    });
  });

  describe('Checkbox', () => {
    const cbProps = {
      ...mockProps,
      type: QuestionType.CHECKBOX,
      options: ['Option A', 'Option B', 'Option C'],
      onCheckboxChange: jest.fn(),
      isCheckboxSelected: jest.fn((value: string) => value === 'Option A'),
    };

    it('should render checkboxes for CHECKBOX type', () => {
      render(<QuestionInput {...cbProps} />);

      expect(screen.getByRole('checkbox', { name: 'Option A' })).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: 'Option B' })).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: 'Option C' })).toBeInTheDocument();
    });

    it('should call onCheckboxChange when checkbox is clicked', () => {
      render(<QuestionInput {...cbProps} />);

      const checkbox = screen.getByRole('checkbox', { name: 'Option B' });
      fireEvent.click(checkbox);

      expect(cbProps.onCheckboxChange).toHaveBeenCalledWith('Option B');
    });

    it('should show checked checkboxes', () => {
      render(<QuestionInput {...cbProps} />);

      expect(screen.getByRole('checkbox', { name: 'Option A' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'Option B' })).not.toBeChecked();
    });
  });
});
