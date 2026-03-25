import { ObjectType, Field, ID } from '@nestjs/graphql';
import { QuestionType, Form, Question, Response, Answer } from '../../../shared/types';

@ObjectType()
export class QuestionModel implements Question {
  @Field(() => ID)
  id!: string;

  @Field()
  text!: string;

  @Field(() => String)
  type!: QuestionType;

  @Field(() => [String], { nullable: true })
  options?: string[];
}

@ObjectType()
export class FormModel implements Form {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [QuestionModel])
  questions!: QuestionModel[];

  @Field({ nullable: true })
  responseCount?: number;
}

@ObjectType()
export class AnswerModel implements Answer {
  @Field()
  questionId!: string;

  @Field(() => String)
  value!: string;
}

@ObjectType()
export class ResponseModel implements Response {
  @Field()
  formId!: string;

  @Field(() => [AnswerModel])
  answers!: AnswerModel[];
}