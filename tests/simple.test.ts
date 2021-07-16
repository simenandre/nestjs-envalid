import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from './src/app.module';

describe('Environment variables', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule.withoutMakeValidators()],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should get server uri', () => {
    const serverUri = app.get(AppModule).getServerUri();
    expect(serverUri).toEqual('hello-world');
  });

  afterEach(async () => {
    await app.close();
  });
});
