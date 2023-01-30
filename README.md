# ENV Config Manager

![cfgmgr 128px](https://github.com/chevdor/confmgr/blob/master/resources/cfgmgr_128px.png?raw=true)

## Intro

`confmgr` is (yet another) configuration manager for your NodeJS apps. It is written in Typescript and thus supports Typescript as well as Javascript.
Check out the [documentation](https://chevdor.github.io/confmgr/) for more details.

**Why **another** one?**

`confmgr` brings interesting features that are not available in libs. While focusing on ease of use, it brings features that no longer need to be part of your app such as:

-   type conversion (variables from ENV are always strings, `confmgr` converts them for you)

-   mandatory values: If you miss a value, `confmgr` will tell you before your app explodes…​

-   default values: `confmrg` handles default values for you

-   regular expressions: `confmgr` allows you defining a regexp that will allow checking the validity of the loaded config

-   masked variables: handy for your secrets, read below

**Helper functions**

After getting your config object with `GetConfig()`, you can simple use it with `config['MYAPP_MYMODULE_VAR1']` or use some of the helper methods attached to your config.

`confmgr` brings a set of handy methods such as `Print()` that will display the content of your config while ensuring that your secrets do NOT show up in any log or output.

Printing your config may use colors or not. Here is an example with color coming from running `config.Print()`:

    ===> TS_SAMPLE_MODULE_01 ENV:
    ✅ PARAM1: some param1
        value: 12
    ✅ PARAM2: some param2
        value: 44
    ✅ SECRET: some secret
        value: *****                                <---- Notice how this value has been masked
    ✅ REGEXP: some regexp
        regexp: ^\d{2}_\d{2}
        value: 68_77
    ✅ MANDAT_WITH_DEF: some optional param
        value: 42
    ❌ MANDAT_NO_DEF: some optional param           <----- It looks like we forgot to pass a value
        value: undefined

If you are using a custom logger, you may also pass it to the `Print()` method so the output gets nicely integrated to your logs while NOT revealing any of your secrets.

## Documentation

You can keep reading this file and/or check the `doc` and `samples` folders.
You can also visit <https://chevdor.gitlab.io/confmgr> to see the old API documentation.

## In a nutshell

### Install

**Using NPM**

    npm install --save confmgr

**Using Yarn**

    yarn add confmgr

### Usage

    import { ConfigManager } from 'confmgr';

    const config = ConfigManager.getInstance('configSpecs.yml').getConfig();
    const valid = config.Validate();
    console.log(`Your config is${valid ? '' : ' NOT'} valid!`);
    config.Print();

The repo contains many more samples in both Typescript and Javascript, using YML and the Specs Factory.

### Features

-   Written in Typescript

-   Available for Typescript or Javascript

-   You create your config specs using a Factory or specs in YAML or JSON format

-   Your config is loaded from your ENV or an .env file

-   Support for multiple .env (debug, etc…​)

-   Your config is validated according to your specs

-   Your config is made available to you in a super easy way

-   You can Print your config in color using the console or use your own logger

-   protects your secret and will never display them

-   will check for value you defined as mandatory and warn you if they are missing

-   supports default values and will apply them has needed

-   supports type for an easy conversion from string to whatever your app needs

## Config Specs

In order to bring a `config` object to your app, you need define some specs first.

That can be done via code using the provided Factory (see samples in the samples folder of the repo). You can also simply provide the specs as a YAML file.

Writing the specs as a YAML file makes it simple to also share the specs of your app to your users as this is very readable.

**Here is how a spec file in the YAML format looks like:**

    MYAPP:                              # Name of your App
      MYMODULE:                         # Name of your module
        VAR1:                           # Here is the simplest example, we named it VAR1
          description: some string
        
        VAR2:
          description: some number
          type: number
          default: 42                   # If for some reason, this value is not set, confmgr will set the default value
        
        VAR3:
          description: some array
          type: array
          default: ['a', 'b', 'c']
        
        VAR4: 
          description: some object
          type: object
          default: { name: "foo", age: 42 }

        VAR5:
          description: A mandatory variable. If that one is missing, will be unhappy
          mandatory: true
         
        VAR6:
          description: A optional variable we can count on
          default: 42

        VAR7:
          description: Some variable we check with a regpex
          regexp: ^\d{2}_\d{2}      

**Here is how a spec file in the JSON format looks like:**

    {
        "SAMPLE": {
            "MODULE": {
                "BOOL1": {
                    "description": "some regexp",
                    "type": "boolean"
                },
                "BOOL2": {
                    "description": "some regexp",
                    "type": "boolean",
                    "regexp": {
                        "pattern": "^true|false$",
                        "attributes": "i"
                    }
                },
                "BOOL3": {
                    "description": "some regexp",
                    "regexp": {
                        "pattern": "^true|false$",
                        "attributes": "i"
                    }
                },
                "URL": {
                    "description": "some web socket URL",
                    "default": "ws://localhost:1234",
                    "regexp": "^wss?://\\w+:\\d+$"
                }
            }
        }
    }

## Config values

### Using ENV Variables

You may pass values as Environment Variables as shown below:

    MYAPP_MODULE_VAR1='foo bar' node index.js

### Generating a default ENV file from the specs

You may let `confmgr` generate a default config file using:

    import { ConfigManager } from 'confmgr'
    const config = ConfigManager.getInstance('configSpecs.yml').getConfig()
    console.log(config.GenEnv().join('\n'))

You can see this in action in the sample 03. The output looks like:

    TS_SAMPLE_MODULE_01_PARAM1=
    TS_SAMPLE_MODULE_01_PARAM2=
    TS_SAMPLE_MODULE_01_SECRET=
    TS_SAMPLE_MODULE_01_BOOL1=true
    TS_SAMPLE_MODULE_01_BOOL2=true
    TS_SAMPLE_MODULE_01_ARRAY1=[1,"a",true,{"foo":"bar"}]
    TS_SAMPLE_MODULE_01_OBJ1={"foo":"bar","list":[1,2,3]}
    TS_SAMPLE_MODULE_02_REGEXP=
    TS_SAMPLE_MODULE_02_MANDAT_WITH_DEF=42
    TS_SAMPLE_MODULE_02_MANDAT_NO_DEF=

### Using default .env file

You may also simply create an `.env` file at the root of your project:

    # Here is a comment
    MYAPP_MODULE_VAR1='foo bar'

You may then simply start your app and the config will be loaded, validated and made available to you.

    node index.js

### Using custom .env file

In some case, you may need different `.env` file for production, testing, staging, dev, etc…​

The default as we saw above is 'production' and the file that is loaded is `.env`.

If you provide the Environment Variable `NODE_ENV` however and this value is neither empty nor `production`, an alternate `.env.<…​>` file will be loaded.

For instance:

-   using `NODE_ENV=dev node index.js` to launch your App will load the config from `.env.dev`

-   using `NODE_ENV=abc node index.js` to launch your App will load the config from `.env.abc`

## YAML Config Specs format

### Prefix & Module

Have you ever looks at the environment variables on your machine? Give it a go and issue `env`. That\`s probably not very pretty…​
Moreover, say your app needs to access a database, using an ENV called `DATABASE` will add even more to this mess.

For this reason, `confmgr` helps you keeps things nice, tidy and collision-free thanks to a `PREFIX` and `MODULE`. Those are 2 strings, usually in CAPS. Any of your configuration value will be prepended with `PREFIX_MODULE_`.

That makes it also very easy to find all the variables of your app using a shell command such as `env | grep MYAPP_MYMODULE`.

The `PREFIX` is the root of your YAML file. You find the `MODULE` just below and then your variables.

At the moment, only a single PREFIX and a single MODULE is supported.

### Variable

A variable is usually named in CAPS. In your YAML, it looks like:

    MYAPP:                              # Name of your App
      MYMODULE:                         # Name of your module
        VAR1:                           # Here is the simplest example, we named it VAR1
          description: some string

Having such as spec means our App expects an ENV called `MYAPP_MYMODULE_VAR1` to be defined. At that point, if the variable is missing or contains an incorrect valule, `confmgr` won’t do anything as it does not know yet about our needs.

The only requirements to define a new variables are:

-   a name (ie. `VAR1`)

-   a description

The description will show up as you Print your config:

    ===> TS_SAMPLE_MODULE_01 ENV:
    ✅ PARAM1: some param1
        value: 12
    ✅ PARAM2: some param2
        value: 44
    ✅ SECRET: some secret
        value: *****

### Options

Options are optional…​ I said it…​

The best to see what they are is to search for the `ConfigItemOptions` type in the code:

    export type ConfigItemOptions = {
        masked?: boolean // true for tokens, passwords, etc..
        regexp?: RegExp | RegexpWithAttributes // validation regexp
        mandatory?: boolean // Do we explode if this ENV is not defined and there is no default?
        default?: ConfigValue // The default if nothing is provided
        type?: Type // If provided, the ConfigManager will do some conversion for us
    }

#### Masked

If a variable is marked as `masked=true`, its value will never be shown when using `Print`.

#### Regexp

You may add validation your variables using a regular expression.

    MYAPP:
      MYMODULE:
        REGEXP:
          description: some regexp
          regexp: ^\d{2}_\d{2}

means and enforces that `MYAPP_MYMODULE_REGEXP` contains a value made of 2 digits followed by underscore and another 2 digits.
`12_34` would be valid whereas `123_45` is not.

#### Default

If your ENV does not contain this value, the default will be applied.

#### Mandatory

If your ENV does not contain this value and you did not define a `default`, then the validation of your config with `config.Validate()` will fail (= return false) and using `config.Print()` will highlight issues as shown below:

    ===> TS_SAMPLE_MODULE_01 ENV:
    ✅ MANDAT_WITH_DEF: some optional param
        value: 42
    ❌ MANDAT_NO_DEF: some optional param
        value: undefined

#### Type

The supported types can also be found in the code:

    /**
     * This describes the type of the config items.
     */
    export type Type = 'string' | 'boolean' | 'number' | 'array' | 'object'

## Usage

**Javascript**

        const ConfigManager = require('confmgr').ConfigManager;

**Typescript**

        import { ConfigManager } from 'confmgr';

### Some details

You may have a look at the samples in the `samples` folder. There are simple demos in Typescript and Javascript.

In short, you first need to define the specs of your config. You can do that using Yaml or using a Factory directly, as shown below:

**Using a Yaml file**

This is the commend option and likely the easiest one.

    TS_SAMPLE:
      MODULE_01:
        PARAM1:
          description: some param1
        PARAM2:
          description: some param2
        SECRET:
          description: some secret
          masked: true
        BOOL1:
          description: bool1
          type: boolean
          default: true
        BOOL2:
          description: bool2
          type: boolean
          default: true
        ARRAY1:
          description: some array
          default: [1, 'a', true, { foo: bar }]
        OBJ1:
          description: some object
          default: { foo: bar, list: [1, 2, 3] }

      MODULE_02:
        REGEXP:
          description: some regexp
          regexp: ^\d{2}_\d{2}
        MANDAT_WITH_DEF:
          description: some optional param
          mandatory: true
          default: 42
        MANDAT_NO_DEF:
          description: some optional param
          mandatory: true

**Using the Factory**

    import { SpecsFactory } from 'confmgr'

    const prefix = 'TS_SAMPLE'
    const mod = 'MODULE_01'

    const factory = new SpecsFactory({ prefix })
    factory.appendSpec(mod, factory.getSpec('PARAM1', 'some param1'))
    factory.appendSpec(mod, factory.getSpec('PARAM2', 'some param2'))
    factory.appendSpec(
        mod,
        factory.getSpec('SECRET', 'some secret', { masked: true })
    )
    factory.appendSpec(
        mod,
        factory.getSpec('REGEXP', 'some regexp', { regexp: /^\d{2}_\d{2}/ })
    )
    factory.appendSpec(
        mod,
        factory.getSpec('MANDAT1', 'some mandatory param', { mandatory: true })
    )
    const specs = factory.getSpecs()

    export default specs

Once you defined the specs for your config, you need to create an `.env` file (unless you plan on passing the config as Environment Variables). It looks as following for the specs mentioned above:

    TS_SAMPLE_MODULE_01_PARAM1=12
    TS_SAMPLE_MODULE_01_PARAM2=44
    TS_SAMPLE_MODULE_01_SECRET=secret
    TS_SAMPLE_MODULE_01_REGEXP=68_77
    TS_SAMPLE_MODULE_01_MANDAT1=27

You may now use your config:

    import { ConfigManager } from 'confmgr'
    import mySpecs from './configSpecs'

    const config = ConfigManager.getInstance(mySpecs).getConfig()
    const valid = config.Validate()
    console.log(`Your config is${valid ? '' : ' NOT'} valid!`)

    config.Print({ color: true, compact: false })

    console.log(`PARAM1=${config.Get('MODULE_01', 'PARAM1')}`)

You should never display your config, especially in your logs, as it may contain some secrets! Instead, use the Print() method of the ConfigManager, it will mask sensible data.

## Dev

First run:

    yarn setup

Then you may for instance start with the tests:

    yarn test:watch

## Contributing

If you are considering contributing, you will find many ways to apply your skills. There is still a lot that can be done in this project. Feel free to submit any PR you think may improve the lib or stop by the issue list and check the [Contributions Welcome](https://github.com/chevdor/confmgr/issues?label_name%5B%5D=Contribution+Welcome) label, it may give you a few ideas.

You may report any bug or submit your PRs at <https://github.com/chevdor/confmgr>

# Samples

# TS Basic with valid .env

Run with the following:

    yarn clean
    yarn
    yarn start

**Specs**

    import { SpecsFactory } from 'confmgr'

    const prefix = 'TS_SAMPLE'
    const mod = 'MODULE_01'

    const factory = new SpecsFactory({ prefix })
    factory.appendSpec(mod, factory.getSpec('PARAM1', 'some param1'))
    factory.appendSpec(mod, factory.getSpec('PARAM2', 'some param2'))
    factory.appendSpec(
        mod,
        factory.getSpec('SECRET', 'some secret', { masked: true })
    )
    factory.appendSpec(
        mod,
        factory.getSpec('REGEXP', 'some regexp', { regexp: /^\d{2}_\d{2}/ })
    )
    factory.appendSpec(
        mod,
        factory.getSpec('MANDAT1', 'some mandatory param', { mandatory: true })
    )
    const specs = factory.getSpecs()

    export default specs

**Example**

    import { ConfigManager } from 'confmgr'
    import mySpecs from './configSpecs'

    const config = ConfigManager.getInstance(mySpecs).getConfig()
    const valid = config.Validate()
    console.log(`Your config is${valid ? '' : ' NOT'} valid!`)

    config.Print({ color: true, compact: false })

    console.log(`PARAM1=${config.Get('MODULE_01', 'PARAM1')}`)

# TS Basic with INvalid .env

This is a Typescript sample.

Run with the following:

    yarn clean
    yarn
    yarn start

**Specs**

    import { SpecsFactory } from 'confmgr'

    const prefix = 'TS_SAMPLE'
    const mod = 'MODULE_01'

    const factory = new SpecsFactory({ prefix })
    factory.appendSpec(mod, factory.getSpec('PARAM1', 'some param1'))
    factory.appendSpec(mod, factory.getSpec('PARAM2', 'some param2'))
    factory.appendSpec(
        mod,
        factory.getSpec('SECRET', 'some secret', { masked: true })
    )
    factory.appendSpec(
        mod,
        factory.getSpec('REGEXP', 'some regexp', { regexp: /^\d{2}_\d{2}/ })
    )
    factory.appendSpec(
        mod,
        factory.getSpec('MANDAT1', 'some mandatory param', { mandatory: true })
    )
    const specs = factory.getSpecs()

    export default specs

**Example**

    import { ConfigManager } from 'confmgr'
    import mySpecs from './configSpecs'

    const config = ConfigManager.getInstance(mySpecs).getConfig()
    const valid = config.Validate()
    console.log(`Your config is${valid ? '' : ' NOT'} valid!`)

    // Here is our custom logger...
    function MyLogger(...args): void {
        const s = args.join(' ')
        console.log(`▶ ${s.replace('\n', '\n▶')}`)
    }

    config.Print({ color: true, logger: MyLogger })

# TS Basic using a YAML spec

This is a Typescript sample.

Run with the following:

    yarn clean
    yarn
    yarn start

**Specs**

    TS_SAMPLE:
      MODULE_01:
        PARAM1:
          description: some param1
        PARAM2:
          description: some param2
        SECRET:
          description: some secret
          masked: true
        BOOL1:
          description: bool1
          type: boolean
          default: true
        BOOL2:
          description: bool2
          type: boolean
          default: true
        ARRAY1:
          description: some array
          default: [1, 'a', true, { foo: bar }]
        OBJ1:
          description: some object
          default: { foo: bar, list: [1, 2, 3] }

      MODULE_02:
        REGEXP:
          description: some regexp
          regexp: ^\d{2}_\d{2}
        MANDAT_WITH_DEF:
          description: some optional param
          mandatory: true
          default: 42
        MANDAT_NO_DEF:
          description: some optional param
          mandatory: true

**Example**

    import { ConfigManager } from 'confmgr'

    const config = ConfigManager.getInstance('configSpecs.yml').getConfig()
    const valid = config.Validate()
    console.log(`Your config is${valid ? '' : ' NOT'} valid!`)

    config.Print({ compact: true })

    console.log('\nYour default config looks like:')
    console.log(config.GenEnv().join('\n'))

    console.log('\nHere are some values:')
    console.log(` - PARAM1=${config.Get('MODULE_01', 'PARAM1')}`)
    console.log(` - BOOL1=${config.Get('MODULE_01', 'BOOL1')}`)
    console.log(` - BOOL2=${config.Get('MODULE_01', 'BOOL2')}`)

# JS Basic with valid .env

This is a Javascript sample.

Run with the following:

    yarn clean
    yarn
    yarn start

**Specs**

    const SpecsFactory = require('confmgr')
    const prefix = 'SAMPLE'
    const mod = 'MODULE'
    const factory = new SpecsFactory.SpecsFactory({ prefix: prefix })
    factory.appendSpec(mod, factory.getSpec('PARAM1', 'some param1'))
    factory.appendSpec(mod, factory.getSpec('PARAM2', 'some param2'))
    factory.appendSpec(
        mod,
        factory.getSpec('SECRET', 'some secret', { masked: true })
    )
    factory.appendSpec(
        mod,
        factory.getSpec('REGEXP', 'some regexp', { regexp: /^\d{2}_\d{2}/ })
    )
    factory.appendSpec(
        mod,
        factory.getSpec('MANDAT1', 'some mandatory param', { mandatory: true })
    )
    const specs = factory.getSpecs()
    exports['default'] = specs

**Example**

    const ConfigManager = require('confmgr').ConfigManager
    const mySpecs = require('./configSpecs').default

    const config = ConfigManager.getInstance(mySpecs).getConfig()
    const valid = config.Validate()
    console.log(`Your config is${valid ? '' : ' NOT'} valid!`)

    config.Print({ logger: console.log })

## License

    Copyright 2020 - Wilfried Kopp / Chevdor

    Permission is hereby granted, free of charge, to any person obtaining a copy of 
    this software and associated documentation files (the "Software"), to deal in 
    the Software without restriction, including without limitation the rights to 
    use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
    of the Software, and to permit persons to whom the Software is furnished to do 
    so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all 
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
    SOFTWARE.
