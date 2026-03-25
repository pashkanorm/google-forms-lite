import { render, screen } from '@testing-library/react';
import ResponsesTable from './ResponsesTable';
import type { Form, Response } from '../../../shared/types';
import { QuestionType } from '../../../shared/types';

describe('ResponsesTable', () => {
  const mockForm: Form = {
    id: 'form1',
    title: 'Test Form',
    description: 'Test Description',
    questions: [
      {
        id: 'q1',
        text: 'What is your name?',
        type: QuestionType.TEXT,
      },
      {
        id: 'q2',
        text: 'What is your age?',
        type: QuestionType.TEXT,
      },
      {
        id: 'q3',
        text: 'Favorite colors?',
        type: QuestionType.CHECKBOX,
        options: ['Red', 'Blue', 'Green'],
      },
    ],
  };

  const responses: Response[] = [
    {
      formId: 'form1',
      answers: [
        { questionId: 'q1', value: 'John Doe' },
        { questionId: 'q2', value: '25' },
        { questionId: 'q3', value: 'Red|Blue' },
      ],
    },
    {
      formId: 'form1',
      answers: [
        { questionId: 'q1', value: 'Jane Smith' },
        { questionId: 'q2', value: '30' },
        { questionId: 'q3', value: 'Green' },
      ],
    },
  ];

  it('should render table with headers for all questions', () => {
    render(<ResponsesTable form={mockForm} responses={responses} />);

    expect(screen.getByText(/What is your name\?/)).toBeInTheDocument();
    expect(screen.getByText(/What is your age\?/)).toBeInTheDocument();
    expect(screen.getByText(/Favorite colors\?/)).toBeInTheDocument();
  });

  it('should render rows for all responses', () => {
    render(<ResponsesTable form={mockForm} responses={responses} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should display answers in correct cells', () => {
    render(<ResponsesTable form={mockForm} responses={responses} />);

    // First response
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();

    // Second response
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('should handle multiple checkbox answers separated by pipe', () => {
    render(<ResponsesTable form={mockForm} responses={responses} />);

    // The table should render the full pipe-separated string or handle it appropriately
    expect(screen.getByText('Red|Blue')).toBeInTheDocument();
  });

  it('should render empty message when no responses', () => {
    render(<ResponsesTable form={mockForm} responses={[]} />);

    expect(screen.getByText('No responses yet')).toBeInTheDocument();
  });

  it('should handle questions with missing answers', () => {
    const incompleteResponses: Response[] = [
      {
        formId: 'form1',
        answers: [{ questionId: 'q1', value: 'John' }], // Missing q2 and q3
      },
    ];

    render(<ResponsesTable form={mockForm} responses={incompleteResponses} />);

    expect(screen.getByText('John')).toBeInTheDocument();
    // Missing answers should show as dashes
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });

  it('should render correct number of rows', () => {
    const { container } = render(<ResponsesTable form={mockForm} responses={responses} />);

    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(2); // Two responses
  });

  it('should render form with single question', () => {
    const singleQuestionForm: Form = {
      id: 'form2',
      title: 'Simple Form',
      questions: [
        {
          id: 'q1',
          text: 'What is your name?',
          type: QuestionType.TEXT,
        },
      ],
    };

    render(<ResponsesTable form={singleQuestionForm} responses={responses} />);

    expect(screen.getByText(/What is your name\?/)).toBeInTheDocument();
  });
});
