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
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger'

const editAnswerBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()).default([]),
})

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema)

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>

@Controller('/answers/:id')
@ApiTags('Answers') // Categorizing under 'Questions' tag in Swagger UI
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  @ApiOperation({
    summary: 'Edit an answer',
    description: 'Edits the content of an existing answer.',
  })
  @ApiBody({
    description: 'Request body to edit an answer',
    type: Object,
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string' },
        attachments: {
          type: 'array',
          items: {
            type: 'string',
            format: 'uuid',
          },
        },
      },
      required: ['content'],
    },
  })
  @ApiResponse({
    status: 204,
    description: 'Answer edited successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Invalid input data',
  })
  async handle(
    @Body(bodyValidationPipe) body: EditAnswerBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') answerId: string,
  ) {
    const { content, attachments } = body
    const { sub: userId } = user

    const result = await this.editAnswer.execute({
      content,
      authorId: userId,
      attachmentsIds: attachments,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
