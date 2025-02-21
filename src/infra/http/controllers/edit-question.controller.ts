import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger'

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()).default([]),
})

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema)

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

@Controller('/questions/:id')
@ApiTags('Questions') // Categorizing under 'Questions' tag in Swagger UI
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  @ApiOperation({
    summary: 'Edit a question',
    description: 'Edits the content of an existing question.',
  })
  @ApiBody({
    description: 'Request body to edit a question',
    type: Object,
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        attachments: {
          type: 'array',
          items: {
            type: 'string',
            format: 'uuid',
          },
        },
      },
      required: ['title', 'content'],
    },
  })
  @ApiResponse({
    status: 204,
    description: 'Question edited successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Invalid input data',
  })
  async handle(
    @Body(bodyValidationPipe) body: EditQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ) {
    const { title, content, attachments } = body
    const { sub: userId } = user

    const result = await this.editQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: attachments,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
