<h1 align="center">Welcome to promise-queuer 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/@vwp/promise-queuer" target="_blank">
    <img alt="Version" src="https://img.shields.io/badge/version-0.1.5-blue.svg?cacheSeconds=2592000" />
  </a>
  <a href="https://github.com/JVictorV/promise-queuer#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/JVictorV/promise-queuer/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/JVictorV/promise-queuer/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> A package to manage promises in a queue

### [Homepage](https://github.com/JVictorV/promise-queuer#readme)

## Install

```sh
yarn add @vwp/promise-queuer
```

## Usage

This package works with an array of objects that's consumed in a promise.
To create a queue, you need to define one type `T` of objects in `PromiseQueuer.factory`

Example:
```js
  interface PromiseObject {
    value: number;
  }
  const queuer = PromiseQueuer.factory<PromiseObject>()
```

The queue has some default properties:
* debugStatus: `false` 
  * When true, will enable debug mode, with some `console.log` that will help you to understand the complete flow of `promise-queuer`
* maxAttempts: `5`
  * Max times a promise will repeat if fail in queue
* timeout: `1500`
  * Timeout in milliseconds, when the promise overtime it, it will be rejected

If you want to override, call the factory like this:
 ```js
  interface PromiseObject {
    value: number;
  }
  /* 
  PromiseQueuer.factory<T>(
    debugStatus: boolean, 
    maxAttempts: number, 
    timeout: number
  )
  */
  const queuer = PromiseQueuer.factory<PromiseObject>(true, 10, 5000)
 ```

Now you can add objects of type `T` to the queue

Example:
```js
  const firstObject: PromiseObject = { value: 1 };
  const secondObject: PromiseObject = { value: 2 };

  queuer.addToQueue(firstObject);
  queuer.addToQueue(secondObject);
```

To run the queuer, just call the method `runQueue` passing the Promise that will consume objects of type `T`

Example: 
```js
  const resolver = (object: PromiseQueuer) => new Promise(
    (resolve, reject) => setTimeout(() => resolve(object.value)
  , 1500)

  queuer.runQueue(resolver);
```

The method `runQueue` have another two optional parameters:
* `callback: (params: any) : Promise<any> | any`
  * Callback function when PromiseObject is resolved
* `calbackError: (params: any) : Promise<any> | any`
  * Callback function when PromiseObject is rejected and dont have more attempts

Example: 
```js
  const resolver = (object: PromiseQueuer) => new Promise(
    (resolve, reject) => setTimeout(() => resolve(object.value)
  , 1500);

  const callback = (result) => console.log('Callback result:', result);

  const callbackError = (result) => console.log('Callback error result:', result);

  queuer.runQueue(resolver, callback, callbackError);
```

## Authors

**João Victor Visoná de Oliveira**
* Github: [@JVictorV](https://github.com/JVictorV)

**Eduardo Santos de Brito**
* Github: [@EduSantosBrito](https://github.com/EduSantosBrito)

## Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/JVictorV/promise-queuer/issues).

## Show your support

Give a ⭐️ if this project helped you!

## License

Copyright © 2019 [João Victor Visoná de Oliveira](https://github.com/JVictorV) AND [Eduardo Santos de Brito](https://github.com/EduSantosBrito).<br />
This project is [MIT](https://github.com/JVictorV/promise-queuer/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_