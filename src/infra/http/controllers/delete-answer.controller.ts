import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'

@Controller('/answers/:id')
@ApiTags('Answers') // Categorizing under 'Answers' tag in Swagger UI
export class DeleteAnswerController {
  constructor(private deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete an answer', // Operation summary
    description:
      'This endpoint allows an authenticated user to delete an answer.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the answer to be deleted',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: 'Answer deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request: Invalid input or the answer does not exist',
  })
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerId: string,
  ) {
    const { sub: userId } = user

    const result = await this.deleteAnswer.execute({
      authorId: userId,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
