import { DynamicModule, Inject, Module } from '@nestjs/common';
import {
  ENVALID,
  EnvalidModule,
  Static,
  makeValidators,
  str,
} from '../../src/plugin.js';

const validators = makeValidators({
  SERVER_URI: str(),
});

type Config = Static<typeof validators>;

@Module({})
export class AppModule {
  constructor(@Inject(ENVALID) private readonly envalid: Config) {}

  static withServerUri(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        EnvalidModule.forRoot({
          environment: {
            SERVER_URI: 'hello-world',
          },
          validators,
        }),
      ],
    };
  }

  static withoutMakeValidators(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        EnvalidModule.forRoot({
          environment: {
            SERVER_URI: 'hello-world',
          },
          validators: {
            SERVER_URI: str(),
          },
        }),
      ],
    };
  }

  getServerUri(): string {
    return this.envalid.SERVER_URI;
  }
}
