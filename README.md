# lit-route

#### Client-side routing for lit-html single page applications :fire::fire:

Inspired by [React-Router](https://reacttraining.com/react-router/).

## Get started

You can see lit-route in action in an example app [here](https://github.com/jamesddavies/lit-pl).

### Install

```javascript
npm install lit-route
```

### Router

```javascript
import {html, render} from 'lit-html'
import {Router} from 'lit-route' //Remember to use relative paths when using ES6 modules

const app = () => html`<h1>Hello world!</h1>`

const appRoot = document.getElementById('applicationRoot')

const router = new Router(() => render(app(), appRoot), appRoot)
router.init()
```

To initialise a new lit-html and lit-route app, import the Router class, create a new ```Router``` instance and pass it your app's render function and the HTML element that will hold your app. Finally, call the Router's ``` init() ``` method to initialise your app.

### Route

```javascript
import {html} from 'lit-html'
import {Route} from 'lit-route'

const DogComponent = () => html`<img src='img/cooldog.png'>`
const CatComponent = () => html`<img src='img/nicecatpng'>`

const DogRoute = new Route('/dog', () => DogComponent())
const CatRoute = new Route('/cat', () => CatComponent())

const Router = () => html`
    ${DogRoute().mount()}
    ${CatRoute().mount()}
`
```

To add a route to your app, import the Route class, and create a new ```Route``` instance, passing in the URL you want to use and an arrow function that returns the component for that route. To finish adding the Route to your app, ```mount()``` it.

##### Route parameters

```javascript
const DogRoute = new Route('/dog/:name/:breed', (match) => DogComponent(match))

//Use match.params.name and match.params.breed to use the route parameters in your component.
```

lit-route also supports route parameters. All route parameters are optional.

### Links

```javascript
const DogLink = html`<a class='lit-route-link' data-to='/dog'>Dog Link</a>`
```

lit-route doesn't have a Link class, but you can link to your routes by using an ```a``` element with the class ```'lit-route-link'``` and the data attribute ```data-to```.

#### Default Routes

```javascript
import {DefaultRoute} from 'lit-route'

const Router = () => html`
    ${new DefaultRoute(() => NotFoundComponent()).mount()}
`
```

The DefaultRoute class will match any route that you haven't otherwise specified a path for - useful for implementing 404 pages or redirecting users to your homepage if they've followed an incorrect link. **NOTE:** The DefaultRoute *must* be the last route mounted - all the other routes need to be mounted before it so the DefaultRoute knows what routes are being used in your app.

#### Private Routes

```javascript
import {PrivateRoute} from 'lit-route'

var auth = false;

const private = () => PrivateRoute('/dog', auth, () => dog(), () => cat())

// If auth = true, the dog component will render, else the cat component will render.
```

As PrivateRoute is a function rather than a class, it doesn't need to be instantiated. Private routes don't currently support route parameters. A path can be passed in place of the last parameter - lit-route will then redirect to that path if the second parameter ('auth') is false.

#### Redirect

```javascript
import {render} from 'lit-html'
import {Redirect} from 'lit-route'

Redirect('/path', render(app(), document.getElementById('appRoot')))
```

Redirect will simply force your app to the provided path. Some kind of render function must be given to the Redirect function, otherwise your url will update but nothing in the app will change.

---
## Development

lit-route is written in [TypeScript](https://www.typescriptlang.org/).

Clone the repo

```npm link``` to a test project

```tsc -w``` to compile changes