import {TemplateResult, render} from 'lit-html'

export interface MatchObject {
    path: string | null
    url: string
    isExact: boolean
    params: Object
}

export class Route {
    path: string
    component: TemplateResult | Function
    exact?: boolean | undefined

    constructor(path: string, component: TemplateResult | Function, exact?: boolean){
        this.path = path
        this.component = component
        this.exact = exact
    }

    match(): MatchObject | null {
        const match = matchPath(location.pathname, {path: this.path, exact: this.exact})
        return match
    }

    renderComponent(match: MatchObject | null): TemplateResult | Function {
        if (typeof this.component === 'object'){
            return this.component
        } else {
            return this.component(match)
        }
    }

    mount(): TemplateResult | Function | null {
        const match = this.match()
        return !!match ? this.renderComponent(match) : null
    }
}

export class Router {
    render: Function

    constructor(render: Function){
        this.render = render

        window.onpopstate = (event) => {
            this.render()
        }
    }

    init(render: Function): void {
        this.render()

        var forEachNode = function (array: NodeList, callback: Function, scope?: any) {
            for (var i = 0; i < array.length; i++) {
              callback.call(scope, i, array[i]);
            }
        }

        var litRouteLinks = document.querySelectorAll("a.lit-route-link")

        forEachNode(litRouteLinks, (index: any, value: any) => {
            litRouteLinks[index].addEventListener('click', () => {
                history.pushState(null, '', litRouteLinks[index].getAttribute('data-to'))
                this.render()
            })
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
    const url = location.pathname
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