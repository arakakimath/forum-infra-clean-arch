import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  })

  // Defining true in the second parameter to guarantee to nest that environmental variables were validated
  // or else, 'port' is typed as 'number | undefined'
  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  // const configService: ConfigService<Env> = app.get

  const port = configService.get('PORT', { infer: true })

  await app.listen(port)
}
bootstrap()
