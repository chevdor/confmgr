# confmgr

NOTE: This is the short version of the README. You can find more [here](https://gitlab.com/chevdor/confmgr/-/raw/master/README.adoc).

`confmgr` is (yet another) configuration manager for your NodeJS apps. It is written in Typescript and thus supports Typescript as well as Javascript. 

Why *another* one? `confmgr` brings interesting features that are not available in libs. While focusing on ease of use, it brings features that no longer need to be part of your app such as:

- type conversion (variables from ENV are always strings, `confmgr` converts them for you)
- mandatory values: if you miss a value, `confmgr`  will tell you before your app explodes...
- default values: `confmrg` handles default values for you
- regular expressions: `confmgr` allows you defining a regexp that will allow checking the validity of the loaded config
- masked variables: handy for your secrets, read below

`confmgr` also brings a set of handy methods such as `Print()` that will display the content of your config while ensuring that your secrets do NOT show up in any log or output.

Printing your config may use colors or not. Here is an example with color:

```
===> TS_SAMPLE_MODULE_01 ENV:
✅ PARAM1: some param1
    value: 12
✅ PARAM2: some param2
    value: 44
✅ SECRET: some secret
    value: *****
✅ REGEXP: some regexp
    regexp: ^\d{2}_\d{2}
    value: 68_77
✅ MANDAT_WITH_DEF: some optional param
    value: 42
❌ MANDAT_NO_DEF: some optional param
    value: undefined
```

## Install

    npm install --save confmgr

## Usage

    import { ConfigManager } from 'confmgr';

    const config = ConfigManager.getInstance('configSpecs.yml').getConfig();
    const valid = config.Validate();
    console.log(`Your config is${valid ? '' : ' NOT'} valid!`);
    config.Print();

The repo contains many more samples in both Typescript and Javascript, using YML and the Specs Factory.

## Config Specs

In order to bring a `config` object to your app, you define some 'specs' first. That can be done via code using the provided Factory (see samples in the samples folder of the repo). You can also simply provide the specs as a yaml file.

Here is how a spec file in the YML format looks like:
```
MYAPP:
  MYMODULE:
    VAR1:
      description: some string
    
    VAR2:
      description: some number
      type: number
      default: 42
    
    VAR3:
      description: some array
      type: array
      default: ['a', 'b', 'c']
    
    VAR4: 
      description: some object
      type: array
      default: { name: "foo", age: 42 }

    VAR5:
      description: A mandatory variable. If that one is missing, confmgr will be unhappy
      mandatory: true
     
    VAR6:
      description: A optional variable we can count on
      default: 42

    VAR7:
      description: Some variable we check with a regular expression
      regexp: ^\d{2}_\d{2}      
 
```

## Config values

You may pass value as Environment Variables as shown below:

    MYAPP_MODULE_VAR1='foo bar' node index.js

You may also simply create an `.env` file at the root of your project. Such file look like:

    # Here is a comment
    MYAPP_MODULE_VAR1='foo bar'

You may then simply start your app and the config will be loaded, validated and made available to you.

    node index.js



## Tell me more!

Check out the [full doc](https://gitlab.com/chevdor/confmgr/-/raw/master/README.adoc) for more details.

You may report bugs and submit PRs at: [gitlab.com/chevdor/confmgr](https://gitlab.com/chevdor/confmgr)
