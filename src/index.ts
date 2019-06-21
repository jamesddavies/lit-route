export interface MatchObject {
    path: string | null
    url: string
    isExact: boolean
    params: Object
}

export class Route {
    path: string
    component: Function
    exact?: boolean | undefined

    constructor(path: string, component: Function, exact?: boolean){
        this.path = path
        this.component = component
        this.exact = exact
        Store.addRoute(this);
    }

    match(): MatchObject | null {
        return matchPath(location.pathname, {path: this.path, exact: this.exact})
    }

    mount(): Function | null {
        const match = this.match()
        return !!match ? this.component(match) : null
    }
}

export class DefaultRoute {
    component: Function;

    constructor(component: Function){
        this.component = component;
    }

    mount(): Function | null {
        return !Store.routeExists(location.pathname) ? this.component() : null
    }
}

export function PrivateRoute(
        path: string,
        auth: boolean, 
        privateComponent: Function, 
        fallbackComponentOrRoute: Function | string,
        exact?: boolean | undefined
    ): Function | null | void {
    if (!auth){
        if (fallbackComponentOrRoute instanceof Function){
            return new Route(path, fallbackComponentOrRoute, exact).mount();
        } else {
            Redirect(fallbackComponentOrRoute)
        }
    } else {
        return new Route(path, privateComponent, exact).mount();
    }
}

export function Redirect(redirectPath: string, reRender?: Function): void {
    history.pushState(null, '', redirectPath)
    if (reRender){
        reRender();
    }
}

export class Router {
    render: Function
    appRoot: HTMLElement

    constructor(render: Function, appRoot: HTMLElement){
        this.render = render
        this.appRoot = appRoot

        window.onpopstate = () => {
            this.render()
			this.updateCurrentLinks()
        }
    }

    forEachNode(array: NodeList, callback: Function, scope?: any): void {
        for (var i = 0; i < array.length; i++) {
          callback.call(scope, i, array[i]);
        }
    }

    init(): void {
        this.render()

        this.appRoot.addEventListener('click', (e: Event) => {
            if (e.target instanceof HTMLElement){
                let parent: HTMLElement | null = e.target
                do {
                    if (parent.className && (parent.className.indexOf('lit-route-link') > -1)) {
                        let path = parent.getAttribute('data-to') || "";
                        this.reRender(path);
                        break
                    }
                    parent = parent.parentElement
                } while (parent)
            }
        })

        this.updateCurrentLinks()
    }

    reRender(path: string): void {
        history.pushState(null, '', path)
        this.render()
        this.updateCurrentLinks()
    }

    updateCurrentLinks(): void {
        let itemList = document.querySelectorAll("a.lit-route-link")
        this.forEachNode(itemList, (index: any) => {
            let path = itemList[index].getAttribute('data-to') || ""
            if (!!matchPath(location.pathname, {path: path, exact: false})){
                itemList[index].classList.add("current")
            } else {
                itemList[index].classList.remove("current")
            }
        })
    }
}

export interface MatchPathOptions {
    path: string
    exact: boolean | undefined
}

export interface MatchPathResult {
    path: string | null
    url: string
    isExact: boolean
    params: Object
}

export function matchPath(pathname: string, options: MatchPathOptions): MatchPathResult | null {
    const { exact = false, path } = options

    if (!path){
        return {
            path: null,
            url: pathname,
            isExact: true,
            params: {}
        }
    }

    const match = new RegExp(`^\/${pathWithoutParameters(path)}`).exec(pathname);
        
    if (!match){
        return null
    }
    const url = match[0]
    const isExact = url === pathname
    if (exact && !isExact){
        return null
    }

    var params = returnParameters(path)
    
    return {
        path,
        url,
        isExact,
        params
    }
}

function returnParameters(path: string): any {
    const paramNames = path.split('/')
    const paramValues = location.pathname.split('/')

    const params: any = {}

    paramNames.forEach((name: string | number, index: number) => {
        if (name.toString().indexOf(':') > -1){
            params[name.toString().substr(1)] = paramValues[index]
        }
    })

    return params
}

function pathWithoutParameters(path: string): string {
    const pathArray = path.split('/')
    var firstParamIndex = pathArray.length;
    
    for (let i = 0; i < pathArray.length; i++){
        if (pathArray[i].indexOf(':') > -1){
            firstParamIndex = i
            break
        }
    }

    return pathArray.slice(1, firstParamIndex).join('/')
}

class RouteStore {
    routes: Route[]

    constructor(){
        this.routes = [];
    }

    addRoute(route: Route): void {
        this.routes.push(route);
    }

    routeExists(path: string): boolean {
        return this.routes.filter((route: Route) => route.match()).length > 0;
    }
}

const Store = new RouteStore();
