import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  })

  // Defining true in the second parameter to guarantee to nest that environmental variables were validated
  // or else, 'port' is typed as 'number | undefined'
  // const configService = app.get<ConfigService<Env, true>>(ConfigService)
  // const configService: ConfigService<Env> = app.get

  const envService = app.get(EnvService)
  const port = envService.get('PORT')

  await app.listen(port)
}
bootstrap()
