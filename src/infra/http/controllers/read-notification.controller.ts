import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@Controller('/notifications/:notificationId/read')
@ApiTags('Notifications') // Categorizing under 'Questions' tag in Swagger UI
export class ReadNotificationController {
  constructor(private readNotification: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(204)
  @ApiOperation({
    summary: 'Mark a notification as read',
    description:
      'Marks a specific notification as read for the authenticated user.',
  })
  @ApiResponse({
    status: 204,
    description: 'Successfully marked the notification as read',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Invalid notification ID or data',
  })
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('notificationId') notificationId: string,
  ) {
    const result = await this.readNotification.execute({
      notificationId,
      recipientId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
