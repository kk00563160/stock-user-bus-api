import { NestFactory } from "@nestjs/core";
import { UserModule } from "./routes/user.module";
import { ConfigService } from "./infrastructure/configuration/config.service";

async function bootstrap() {
    const app = await NestFactory.create(UserModule)
    var port = ConfigService.create().getPort();
    console.log(port);
    await app.listen(port);
}

bootstrap();