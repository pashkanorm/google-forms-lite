import { createApi, type BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { Form, Response } from '../../../shared/types';
import { QuestionType } from '../../../shared/types';

// Input types for mutations
export interface CreateFormInput {
  title: string;
  description?: string;
  questions?: Array<{
    text: string;
    type: QuestionType;
    options?: string[];
  }>;
}

export interface AnswerInput {
  questionId: string;
  value: string;
}

export interface SubmitResponseInput {
  formId: string;
  answers: AnswerInput[];
}

// GraphQL response wrapper
interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

const API_URL = 'http://localhost:3004/graphql';

// Custom baseQuery that handles GraphQL errors
type GraphQLBaseQuery = BaseQueryFn<
  {
    url: string;
    method: string;
    body: {
      query: string;
      variables?: Record<string, any>;
    };
  },
  unknown,
  unknown
>;

const graphQLBaseQuery: GraphQLBaseQuery = async (args) => {
  const response = await fetch(API_URL, {
    method: args.method || 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args.body),
  });

  const data = (await response.json()) as GraphQLResponse<any>;

  // Handle GraphQL errors
  if (data.errors) {
    return {
      error: {
        status: 400,
        data: {
          message: data.errors[0].message || 'GraphQL error',
        },
      },
    };
  }

  return { data };
};

export const formsApi = createApi({
  reducerPath: 'formsApi',
  baseQuery: graphQLBaseQuery,
  tagTypes: ['Forms', 'Responses'],
  endpoints: (builder) => ({
    // Queries
    getForms: builder.query<Form[], void>({
      query: () => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query GetForms {
              forms {
                id
                title
                description
                responseCount
                questions {
                  id
                  text
                  type
                  options
                }
              }
            }
          `,
        },
      }),
      transformResponse: (response: GraphQLResponse<{ forms: Form[] }>) => response.data?.forms || [],
      providesTags: ['Forms'],
    }),

    getForm: builder.query<Form | null, string>({
      query: (id: string) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query GetForm($id: ID!) {
              form(id: $id) {
                id
                title
                description
                responseCount
                questions {
                  id
                  text
                  type
                  options
                }
              }
            }
          `,
          variables: { id },
        },
      }),
      transformResponse: (response: GraphQLResponse<{ form: Form | null }>) => response.data?.form || null,
      providesTags: ['Forms'],
    }),

    getResponses: builder.query<Response[], string>({
      query: (formId: string) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query GetResponses($formId: ID!) {
              responses(formId: $formId) {
                formId
                answers {
                  questionId
                  value
                }
              }
            }
          `,
          variables: { formId },
        },
      }),
      transformResponse: (response: GraphQLResponse<{ responses: Response[] }>) => response.data?.responses || [],
      providesTags: ['Responses'],
    }),

    // Mutations
    createForm: builder.mutation<Form, CreateFormInput>({
      query: (input: CreateFormInput) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation CreateForm($input: CreateFormInput!) {
              createForm(input: $input) {
                id
                title
                description
                questions {
                  id
                  text
                  type
                  options
                }
              }
            }
          `,
          variables: { input },
        },
      }),
      transformResponse: (response: GraphQLResponse<{ createForm: Form }>) => response.data?.createForm || ({} as Form),
      invalidatesTags: ['Forms'],
    }),

    submitResponse: builder.mutation<Response, SubmitResponseInput>({
      query: (input: SubmitResponseInput) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation SubmitResponse($input: SubmitResponseInput!) {
              submitResponse(input: $input) {
                formId
                answers {
                  questionId
                  value
                }
              }
            }
          `,
          variables: { input },
        },
      }),
      transformResponse: (response: GraphQLResponse<{ submitResponse: Response }>) => response.data?.submitResponse || ({} as Response),
      invalidatesTags: ['Forms', 'Responses'],
    }),
  }),
});

export const {
  useGetFormsQuery,
  useGetFormQuery,
  useGetResponsesQuery,
  useCreateFormMutation,
  useSubmitResponseMutation,
} = formsApi;
