import { Resolver, Query, Mutation, Args, InputType, Field, registerEnumType, ID } from '@nestjs/graphql';
import { v4 as uuidv4 } from 'uuid';
import { QuestionType } from '../../../shared/types';
import { FormModel, QuestionModel, ResponseModel, AnswerModel } from './forms.model';

// Register enum for GraphQL
registerEnumType(QuestionType, {
  name: 'QuestionType',
});

// In-memory DB
const forms: FormModel[] = [];
const responses: Record<string, ResponseModel[]> = {};

// GraphQL Input Types
@InputType()
class QuestionInput {
  @Field()
  text!: string;

  @Field(() => QuestionType)
  type!: QuestionType;

  @Field(() => [String], { nullable: true })
  options?: string[];
}

@InputType()
class AnswerInput {
  @Field()
  questionId!: string;

  @Field(() => String)
  value!: string;
}

@InputType()
class CreateFormInput {
  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [QuestionInput], { nullable: true })
  questions?: QuestionInput[];
}

@InputType()
class SubmitResponseInput {
  @Field(() => ID)
  formId!: string;

  @Field(() => [AnswerInput])
  answers!: AnswerInput[];
}

@Resolver()
export class FormsResolver {
  // Queries
  @Query(() => [FormModel])
  forms(): FormModel[] {
    return forms.map(form => ({
      ...form,
      responseCount: responses[form.id]?.length || 0,
    }));
  }

  @Query(() => FormModel, { nullable: true })
  form(@Args('id', { type: () => ID }) id: string): FormModel | undefined {
    console.log('Form query called with ID:', id);
    console.log('Available forms:', forms.map(f => f.id));
    const result = forms.find(f => f.id === id);
    console.log('Found form:', result);
    if (result) {
      return {
        ...result,
        responseCount: responses[result.id]?.length || 0,
      };
    }
    return result;
  }

  @Query(() => [ResponseModel])
  responses(@Args('formId', { type: () => ID }) formId: string): ResponseModel[] {
    return responses[formId] || [];
  }

  // Mutations
  @Mutation(() => FormModel)
  createForm(@Args('input') input: CreateFormInput): FormModel {
    console.log('CreateForm called with input:', input);
    const newForm: FormModel = {
      id: uuidv4(),
      title: input.title,
      description: input.description,
      questions: input.questions?.map(q => ({
        id: uuidv4(),
        text: q.text,
        type: q.type,
        options: q.options,
      })) || [],
    };
    forms.push(newForm);
    console.log('Form created with ID:', newForm.id);
    console.log('Total forms in store:', forms.length);
    return newForm;
  }

  @Mutation(() => ResponseModel)
  submitResponse(@Args('input') input: SubmitResponseInput): ResponseModel {
    const response: ResponseModel = {
      formId: input.formId,
      answers: input.answers.map(a => ({
        questionId: a.questionId,
        value: a.value,
      })),
    };

    if (!responses[input.formId]) responses[input.formId] = [];
    responses[input.formId].push(response);

    return response;
  }
}