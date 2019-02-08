import { Route } from './index';
import { expect } from 'chai';
import 'mocha';
describe('Route class', () => {
    it('should return a component', () => {
        location.pathname = '/testroute';
        const component = () => `<h1>Test</h1>`;
        const route = new Route('/testroute', () => component);
        expect(route.mount()).to.equal(component);
    });
});
//# sourceMappingURL=index.spec.js.map