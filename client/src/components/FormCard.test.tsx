import { render, screen, fireEvent } from '@testing-library/react';
import FormCard from './FormCard';

describe('FormCard', () => {
  const mockProps = {
    id: '1',
    title: 'Test Form',
    questionCount: 5,
    onViewForm: jest.fn(),
    onViewResponses: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form title', () => {
    render(<FormCard {...mockProps} />);

    expect(screen.getByText('Test Form')).toBeInTheDocument();
  });

  it('should render question count', () => {
    render(<FormCard {...mockProps} />);

    expect(screen.getByText('5 questions')).toBeInTheDocument();
  });

  it('should render singular question text when count is 1', () => {
    render(<FormCard {...mockProps} questionCount={1} />);

    expect(screen.getByText('1 question')).toBeInTheDocument();
  });

  it('should render Fill Form button', () => {
    render(<FormCard {...mockProps} />);

    expect(screen.getByRole('button', { name: 'Fill Form' })).toBeInTheDocument();
  });

  it('should render View Responses button', () => {
    render(<FormCard {...mockProps} responseCount={0} />);

    expect(screen.getByRole('button', { name: 'View Responses (0)' })).toBeInTheDocument();
  });

  it('should call onViewForm when Fill Form button is clicked', () => {
    render(<FormCard {...mockProps} />);

    const fillButton = screen.getByRole('button', { name: 'Fill Form' });
    fireEvent.click(fillButton);

    expect(mockProps.onViewForm).toHaveBeenCalledTimes(1);
  });

  it('should call onViewResponses when View Responses button is clicked', () => {
    render(<FormCard {...mockProps} responseCount={0} />);

    const responsesButton = screen.getByRole('button', { name: 'View Responses (0)' });
    fireEvent.click(responsesButton);

    expect(mockProps.onViewResponses).toHaveBeenCalledTimes(1);
  });

  it('should display response count in View Responses button', () => {
    render(<FormCard {...mockProps} responseCount={5} />);

    expect(screen.getByRole('button', { name: 'View Responses (5)' })).toBeInTheDocument();
  });

  it('should handle click on both buttons independently', () => {
    render(<FormCard {...mockProps} responseCount={0} />);

    const fillButton = screen.getByRole('button', { name: 'Fill Form' });
    const responsesButton = screen.getByRole('button', { name: 'View Responses (0)' });

    fireEvent.click(fillButton);
    fireEvent.click(responsesButton);

    expect(mockProps.onViewForm).toHaveBeenCalledTimes(1);
    expect(mockProps.onViewResponses).toHaveBeenCalledTimes(1);
  });
});
