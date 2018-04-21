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