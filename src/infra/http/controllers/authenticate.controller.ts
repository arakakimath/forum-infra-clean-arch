import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { ApiTags, ApiBody, ApiResponse, ApiOperation } from '@nestjs/swagger' // Importing Swagger decorators
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { z } from 'zod'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials.error'
import { Public } from '@/infra/auth/public'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@Public()
@ApiTags('Users') // Adding the tag for grouping the endpoints related to 'Authentication'
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Authenticate a student and obtain access token' }) // Operation summary
  @ApiBody({
    type: Object,
    description: 'Student credentials for authentication.',
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          description: 'Student email address',
        },
        password: {
          type: 'string',
          description: 'Student password',
        },
      },
    },
    examples: {
      loginExample: {
        summary: 'Example of login',
        description: 'This is an example of login',
        value: {
          email: 'johndoe@example.com',
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful, returns access token',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'JWT access token for the student',
        },
      },
    },
    example: {
      accessToken: 'someToken',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data or inputs',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateStudent.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
