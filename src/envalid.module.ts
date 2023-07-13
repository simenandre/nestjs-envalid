import { DynamicModule, Module } from '@nestjs/common';
import {
  CleanOptions,
  CleanedEnv,
  CleanedEnvAccessors,
  ValidatorSpec,
  cleanEnv,
  customCleanEnv,
  str,
  strictProxyMiddleware,
} from 'envalid';
import { ENVALID } from './envalid.constants.js';

export const nestJsInspectables = [
  'onModuleInit',
  'onModuleDestroy',
  'onApplicationBootstrap',
  'beforeApplicationShutdown',
  'onApplicationShutdown',
  'constructor',
  '__defineGetter__',
  '__defineSetter__',
  '__lookupGetter__',
  '__lookupSetter__',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toString',
  'valueOf',
  'toLocaleString',
];

export type Validators<T = unknown> = {
  [K in keyof T]: ValidatorSpec<T[K]>;
};

export interface MakeValidatorsResult<T = unknown> {
  _specs: Validators<T>;
  values: T;
}

export function makeValidators<T>(
  specs: Validators<T>,
): MakeValidatorsResult<T> {
  return {
    _specs: specs,
    values: specs as unknown as T,
  };
}

export type Static<T extends MakeValidatorsResult> = Readonly<
  T['values'] & CleanedEnvAccessors
>;

export interface EnvalidModuleConfig<S, MW> {
  // An object containing your env vars (default is `process.env`)
  environment?: unknown;

  /**
   * Envalid validators
   * See: https://github.com/af/envalid#api
   */
  validators: Validators<S> | MakeValidatorsResult<S>;

  /**
   * If "true", registers `ConfigModule` as a global module.
   * See: https://docs.nestjs.com/modules#global-modules
   */
  isGlobal?: boolean;

  /**
   * use dotenv to fill process.env
   * See: https://github.com/motdotla/dotenv
   */
  useDotenv?: boolean;

  /**
   * A function that applies transformations to the cleaned env object
   */
  applyMiddleware?: <T extends object>(cleaned: T, rawEnv: unknown) => MW;
}

@Module({})
export class EnvalidModule {
  static async forRoot<S, MW>(
    config: EnvalidModuleConfig<S, MW>,
  ): Promise<DynamicModule> {
    if (config.useDotenv) {
      const dotenv = await import('dotenv');
      dotenv.config();
    }

    const { isGlobal, environment = process.env, applyMiddleware } = config;
    let { validators } = config;

    if ('_specs' in validators) {
      validators = validators._specs;
    }

    const providers = [
      {
        provide: ENVALID,
        useValue: customCleanEnv(environment, validators, (cleaned, rawEnv) => {
          if (applyMiddleware) {
            return applyMiddleware(cleaned, rawEnv);
          }

          return strictProxyMiddleware(cleaned, rawEnv, {
            extraInspectables: nestJsInspectables,
          });
        }),
      },
    ];

    return {
      global: isGlobal,
      module: EnvalidModule,
      exports: providers,
      providers,
    };
  }
}
