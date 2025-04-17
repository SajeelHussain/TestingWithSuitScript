jest.mock('N/cache');
jest.mock('N/log');

const cache = require('N/cache');
const log = require('N/log');

let suitelet;

beforeAll(() => {
    global.define = jest.fn((deps, factory) => {
        suitelet = factory(...deps.map(dep => require(dep)));
    });
    require('../scripts/cache');
});

describe('CacheSuitelet', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        cache.getCache = jest.fn();
        log.audit = jest.fn();
        log.error = jest.fn();
    });

    it('should use cache to retrieve ZIP code mapping', () => {
        const mockCache = {
            get: jest.fn(() => JSON.stringify({"94101": "San Francisco"})),
            remove: jest.fn()
        };
        cache.getCache.mockReturnValue(mockCache);

        const context = {
            request: { parameters: { zipcode: '94101', purgeZipCache: 'false', auditPerf: 'false' } },
            response: { writeLine: jest.fn() }
        };

        suitelet.onRequest(context);

        expect(cache.getCache).toHaveBeenCalledWith({name: 'ZIP_CODES_CACHE', scope: 'PROTECTED'});
        expect(mockCache.get).toHaveBeenCalledWith({
            key: 'ZIP_TO_CITY_IDX_JSON',
            loader: expect.any(Function)
        });
        expect(context.response.writeLine).toHaveBeenCalledWith('San Francisco');
    });

    it('should call loader on cache miss', () => {
        const mockLoader = jest.fn(() => JSON.stringify({"94101": "San Francisco"}));
        const mockCache = {
            get: jest.fn((opts) => opts.loader()),
            remove: jest.fn()
        };
        cache.getCache.mockReturnValue(mockCache);
        // Patch the loader in the implementation
        // The loader is passed as opts.loader in get, so we set it up here
        const context = {
            request: { parameters: { zipcode: '94101', purgeZipCache: 'false', auditPerf: 'false' } },
            response: { writeLine: jest.fn() }
        };
        // Patch the loader in the implementation
        mockCache.get.mockImplementation((opts) => mockLoader());
        suitelet.onRequest(context);
        expect(mockLoader).toHaveBeenCalled();
        expect(context.response.writeLine).toHaveBeenCalledWith('San Francisco');
    });

    it('should purge cache when requested', () => {
        const mockCache = {
            get: jest.fn(() => JSON.stringify({"94101": "San Francisco"})),
            remove: jest.fn()
        };
        cache.getCache.mockReturnValue(mockCache);

        const context = {
            request: { parameters: { zipcode: '94101', purgeZipCache: 'true', auditPerf: 'false' } },
            response: { writeLine: jest.fn() }
        };

        suitelet.onRequest(context);

        expect(cache.getCache).toHaveBeenCalledWith({name: 'ZIP_CODES_CACHE', scope: 'PROTECTED'});
        expect(mockCache.remove).toHaveBeenCalledWith({key: 'ZIP_TO_CITY_IDX_JSON'});
        expect(context.response.writeLine).toHaveBeenCalledWith('San Francisco');
    });

    it('should handle missing zipcode parameter', () => {
        const mockCache = {
            get: jest.fn(),
            remove: jest.fn()
        };
        cache.getCache.mockReturnValue(mockCache);

        const context = {
            request: { parameters: { purgeZipCache: 'false', auditPerf: 'false' } },
            response: { writeLine: jest.fn() }
        };

        suitelet.onRequest(context);

        expect(context.response.writeLine).toHaveBeenCalledWith('Error: zipcode parameter is required');
    });

    
});