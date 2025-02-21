import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { ApiTags, ApiBody, ApiResponse, ApiOperation } from '@nestjs/swagger' // Importing Swagger decorators
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'

const answerQuestionBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()).default([]),
})

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema)

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>

@Controller('/questions/:questionId/answers')
@ApiTags('Answers') // Adding the tag for grouping the endpoints related to 'Answers'
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Answer a question' }) // Operation summary for documentation
  @ApiBody({
    type: Object,
    description: 'Answer content and optional attachments for the question.',
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'Content of the answer',
        },
        attachments: {
          type: 'array',
          items: {
            type: 'string',
            format: 'uuid',
            description: 'Attachment UUIDs associated with the answer',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Answer successfully created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data or inputs',
  })
  async handle(
    @Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
  ) {
    const { content, attachments } = body
    const { sub: userId } = user

    const result = await this.answerQuestion.execute({
      content,
      authorId: userId,
      questionId,
      attachmentsIds: attachments,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
