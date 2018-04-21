import {TemplateResult, render} from 'lit-html'
import {matchPath} from './matchPath'

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