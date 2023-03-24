import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { OpenAPIModule } from 'deepkit-openapi';

import { UserController } from './user/controller';

new App({
  controllers: [UserController],
  imports: [
    new OpenAPIModule({
      prefix: '/openapi/',
      title: 'The title of your APIs',
      description: 'The description of your APIs',
      version: 'x.y.z'
    }),
    new FrameworkModule({
      debug: true,
      port: 4000,
      publicDir: 'public',
      httpLog: true,
      migrateOnStartup: true
    })
  ]
})
  .loadConfigFromEnv()
  .run();
