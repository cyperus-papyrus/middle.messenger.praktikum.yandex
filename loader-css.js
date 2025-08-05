export async function resolve(specifier, context, nextResolve) {
    if (specifier.endsWith('.css') || specifier.endsWith('.pcss')) {
        return {
            shortCircuit: true,
            url: 'data:text/javascript,export default {}'
        };
    }

    return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
    if (url.endsWith('.scss') || url.includes('main.scss')) {
        return {
            format: 'module',
            shortCircuit: true,
            source: 'export default {};'
        };
    }

    return nextLoad(url, context);
}
