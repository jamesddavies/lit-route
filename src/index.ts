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
    }

    match(): MatchObject | null {
        return matchPath(location.pathname, {path: this.path, exact: this.exact})
    }

    mount(): Function | null {
        const match = this.match()
        return !!match ? this.component(match) : null
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
                let parent = e.target.parentElement
                if (e.target.className && (e.target.className.indexOf('lit-route-link') > -1)) {
                    let path = e.target.getAttribute('data-to') || "";
                    this.reRender(path);
                } else if (parent){
                    while (parent){
                        if (parent.className && (parent.className.indexOf('lit-route-link') > -1)) {
                            let path = parent.getAttribute('data-to') || "";
                            this.reRender(path);
                            break
                        }
                        parent = parent.parentElement
                    }
                }
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