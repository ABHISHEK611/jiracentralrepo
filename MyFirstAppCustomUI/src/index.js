import Resolver from '@forge/resolver';

const resolver = new Resolver();

resolver.define('getText', (req) => {
    console.log(req);

    return 'Hello Nature!';
});

resolver.define('getProjectOverview', (req) => {
    console.log(req);
    return 'Project Overview';
});

export const handler = resolver.getDefinitions();