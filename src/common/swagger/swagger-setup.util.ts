import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { envConfig } from '../../config/envs';
import * as basicAuth from 'express-basic-auth';


export const setupSwagger = (app: INestApplication) => {
  if (envConfig.NODE_ENV !== 'development') {
    //añade una contraseña para acceder a la documentación cuando no es en development, utilizando express
    app.use(
      [envConfig.SWAGGER_PATH, `${envConfig.SWAGGER_PATH}-json`],
      basicAuth.default({
        challenge: true,
        users: {
          admin: envConfig.SWAGGER_PASSWORD
        }
      })
    );
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Full Salud API')
    .setDescription('')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(envConfig.SWAGGER_PATH, app, swaggerDocument, {
      customSiteTitle: 'Backend Generator',
      customfavIcon: 'https://avatars.githubusercontent.com/u/185267919?s=400&u=7d74f9c123b27391d3f11da2815de1e9a1031ca9&v=4',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
      ],
      customCssUrl: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
      ],
    }
  );
};
