import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@Controller('/questions/:id')
@ApiTags('Questions') // Categorizing under 'Questions' tag in Swagger UI
export class DeleteQuestionController {
  constructor(private deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete a question',
    description: 'Deletes a question by its ID.',
  })
  @ApiResponse({
    status: 204,
    description: 'Question deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Invalid input data or operation',
  })
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ) {
    const { sub: userId } = user

    const result = await this.deleteQuestion.execute({
      authorId: userId,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
