import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger' // Importing Swagger decorators
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'

@Controller('/answers/:answerId/choose-as-best')
@ApiTags('Answers') // Tag for grouping the 'Answers' section in Swagger UI
export class ChooseQuestionBestAnswerController {
  constructor(
    private chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase,
  ) {}

  @Patch()
  @ApiOperation({ summary: 'Choose a best answer for a question' }) // Operation summary
  @ApiResponse({
    status: 204,
    description: 'The answer has been successfully chosen as the best answer.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - The action could not be performed.',
  })
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string,
  ) {
    const { sub: userId } = user

    const result = await this.chooseQuestionBestAnswer.execute({
      authorId: userId,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
