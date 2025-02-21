import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { QuestionDetailsPresenter } from '../presenters/question-details.presenter'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@Controller('/questions/:slug')
@ApiTags('Questions') // Categorizing under 'Questions' tag in Swagger UI
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Get a question by its slug',
    description: 'Gets the details of a question using its slug.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched the question details',
    schema: {
      type: 'object',
      properties: {
        question: { type: 'object' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Invalid slug or data',
  })
  async handle(@Param('slug') slug: string) {
    const result = await this.getQuestionBySlug.execute({ slug })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { question: QuestionDetailsPresenter.toHTTP(result.value.question) }
  }
}
