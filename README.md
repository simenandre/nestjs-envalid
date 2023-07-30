<h1 align="center">nestjs-envalid</h1>

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)

[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/cobraz/nestjs-envalid.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/cobraz/nestjs-envalid/context:javascript)
[![codecov](https://codecov.io/gh/cobraz/nestjs-envalid/branch/main/graph/badge.svg)](https://codecov.io/gh/cobraz/nestjs-envalid)
[![Maintainability](https://api.codeclimate.com/v1/badges/8549751f50ac68b36842/maintainability)](https://codeclimate.com/github/cobraz/nestjs-envalid/maintainability)

> [Envalid][] is a small library for validating and accessing environment
> variables in Node.js (v14.16 or later) programs, aiming to:
>
> - ensure that your program only runs when all of its environment dependencies
>   are met
> - give you executable documentation about the environment your program expects
>   to run in
> - give you an immutable API for your environment variables, so they don't
>   change from under you while the program is running

---

`nestjs-envalid` is simple wrapper on top of [envalid][] made for [NestJS][]

[envalid]: https://github.com/af/envalid
[nestjs]: https://github.com/nestjs/nest

**Note**: This package is [pure ESM][esm], which requires you to add `"type": "module"` to
your `package.json` file. If you're using CommonJS, you can for now [use the `legacy`
tag on NPM to use the latest version of v1][v1]. The legacy version will be supported
for now, but we will eventually drop support for it.

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
[v1]: #common-js--version-1

## Quickstart

```sh
yarn add nestjs-envalid envalid
```

To improve readability you can configure the variables in a separate file named
`config.ts`, like the example below:

```typescript
import { makeValidators, num, Static } from 'nestjs-envalid';

export const validators = makeValidators({
  PORT: num({ default: 3000 }),
});

export type Config = Static<typeof validators>;
```

The `validators` can then be added to `EnvalidModule`, like so:

```typescript
import { EnvalidModule } from 'nestjs-envalid';
import { validators } from './config';

@Module({
  imports: [EnvalidModule.forRoot({ validators })],
})
export class AppModule {}
```

To inject your configuration, you can do this:

```typescript
import { ENVALID, Config } from './config';

@Injectable()
export class SomeService {
  constructor(@Inject(ENVALID) private readonly env: Config) {}

  someMethod() {
    if (this.env.isProd) {
      const other = this.env.HELLO_WORLD;
    }
  }
}
```

## Add support for dotenv

You'll need to install `dotenv`. 

```sh
yarn add dotenv
```

Next, just set `useDotenv` to `true`

```typescript
import { validators } from './config';
@Module({
  imports: [EnvalidModule.forRoot({ validators, useDotenv: true })],
})
export class AppModule {}
```

## Common JS / Version 1

If you need either support for Node 8.12 or above or CommonJS, you can use the
legacy version of this package. To do so, you'll need to use the `legacy` tag.

```shell
yarn add nestjs-envalid@legacy envalid
```

The legacy version will be supported for now, but we will eventually drop support for it.
We will notify you when we eventually do, at least a few months before, but you should
migrate to ESM as soon as possible.

## Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check
[issues page](https://github.com/cobraz/nestjs-envalid/issues).

Give a ⭐️ if this project helped you!
