import {
  Body,
  Controller,
  Post,
  UsePipes,
  HttpCode,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'
import { ApiTags, ApiBody, ApiResponse, ApiOperation } from '@nestjs/swagger' // Include ApiOperation here
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { Public } from '@/infra/auth/public'

import { z } from 'zod'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists.error'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
@Public()
@ApiTags('Users') // Group under 'Users'
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  @ApiOperation({
    summary: 'Create a new account for a user', // Operation description
    description: 'This endpoint allows the creation of a new user account.',
  })
  @ApiBody({
    description: 'Request body to create an account',
    type: Object,
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: {
          type: 'string',
          format: 'email',
        },
        password: { type: 'string' },
      },
      required: ['name', 'email', 'password'],
    },
    examples: {
      createAccountExample: {
        summary: 'Example of a new user account',
        description: 'This is an example of a new user creating an account',
        value: {
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Account created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: Student already exists',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request: Invalid input data',
  })
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    const result = await this.registerStudent.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
