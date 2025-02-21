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
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'

@Controller('/answers/comments/:id')
@ApiTags('Comments') // Categorizing under 'Comments' tag in Swagger UI
export class DeleteAnswerCommentController {
  constructor(private deleteAnswerComment: DeleteAnswerCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete a comment on an answer', // Operation summary
    description:
      'This endpoint allows an authenticated user to delete a comment on an answer.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the answer comment to be deleted',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: 'Comment deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request: Invalid input or the comment does not exist',
  })
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerCommentId: string,
  ) {
    const { sub: userId } = user

    const result = await this.deleteAnswerComment.execute({
      authorId: userId,
      answerCommentId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
