import { render, screen, fireEvent } from '@testing-library/react';
import QuestionEditor from './QuestionEditor';
import { QuestionType } from '../../../shared/types';

describe('QuestionEditor', () => {
  const mockProps = {
    id: 'q1',
    text: 'What is your favorite color?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['Red', 'Blue', 'Green'],
    onUpdateText: jest.fn(),
    onUpdateType: jest.fn(),
    onAddOption: jest.fn(),
    onRemoveOption: jest.fn(),
    onUpdateOption: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render question text input', () => {
    render(<QuestionEditor {...mockProps} />);

    expect(screen.getByDisplayValue(mockProps.text)).toBeInTheDocument();
  });

  it('should render question type select', () => {
    render(<QuestionEditor {...mockProps} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe(QuestionType.MULTIPLE_CHOICE);
  });

  it('should call onUpdateText when question text changes', () => {
    render(<QuestionEditor {...mockProps} />);

    const input = screen.getByDisplayValue(mockProps.text) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'New question text' } });

    expect(mockProps.onUpdateText).toHaveBeenCalledWith('New question text');
  });

  it('should call onUpdateType when question type changes', () => {
    render(<QuestionEditor {...mockProps} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: QuestionType.TEXT } });

    expect(mockProps.onUpdateType).toHaveBeenCalledWith(QuestionType.TEXT);
  });

  it('should render all options', () => {
    render(<QuestionEditor {...mockProps} />);

    expect(screen.getByDisplayValue('Red')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Blue')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Green')).toBeInTheDocument();
  });

  it('should call onAddOption when Add Option button is clicked', () => {
    render(<QuestionEditor {...mockProps} />);

    const addButton = screen.getByRole('button', { name: /add option/i });
    fireEvent.click(addButton);

    expect(mockProps.onAddOption).toHaveBeenCalledTimes(1);
  });

  it('should call onUpdateOption when option text changes', () => {
    render(<QuestionEditor {...mockProps} />);

    const optionInput = screen.getByDisplayValue('Blue') as HTMLInputElement;
    fireEvent.change(optionInput, { target: { value: 'Yellow' } });

    expect(mockProps.onUpdateOption).toHaveBeenCalledWith(1, 'Yellow');
  });

  it('should render Delete button', () => {
    render(<QuestionEditor {...mockProps} />);

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('should call onDelete when Delete button is clicked', () => {
    render(<QuestionEditor {...mockProps} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockProps.onDelete).toHaveBeenCalledTimes(1);
  });

  it('should not render options for TEXT type question', () => {
    const textProps = { ...mockProps, type: QuestionType.TEXT, options: undefined };
    render(<QuestionEditor {...textProps} />);

    expect(screen.queryByRole('button', { name: /add option/i })).not.toBeInTheDocument();
  });

  it('should not render options for DATE type question', () => {
    const dateProps = { ...mockProps, type: QuestionType.DATE, options: undefined };
    render(<QuestionEditor {...dateProps} />);

    expect(screen.queryByRole('button', { name: /add option/i })).not.toBeInTheDocument();
  });

  it('should render all question type options', () => {
    render(<QuestionEditor {...mockProps} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    const options = Array.from(select.options).map((option) => option.value);

    expect(options).toContain(QuestionType.TEXT);
    expect(options).toContain(QuestionType.DATE);
    expect(options).toContain(QuestionType.MULTIPLE_CHOICE);
    expect(options).toContain(QuestionType.CHECKBOX);
  });
});
