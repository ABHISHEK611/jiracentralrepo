import Resolver from '@forge/resolver';
const resolver = new Resolver();

resolver.define('getText', (req) => {
    return 'Hello world!';
});
resolver.define('getContext', (req) => {
    const context = req.context;
    return context;
})

export const handler = resolver.getDefinitions();