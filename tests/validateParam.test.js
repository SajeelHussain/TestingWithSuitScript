// tests/validateParam.test.js
jest.mock('N/error');

const error = require('N/error');

let validateModule;

beforeAll(async () => {
    global.define = jest.fn((deps, factory) => {
        validateModule = factory(...deps.map(dep => require(dep)));
    });

    require('../scripts/validateParam');
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('validate()', () => {
    it('should throw a custom error when param is missing', () => {
        const mockError = new Error('Custom');
        mockError.name = 'MISSING_PARAM';
        mockError.message = 'The required parameter is missing.';

        error.create.mockReturnValue(mockError);

        expect(() => validateModule.validate(null)).toThrow(mockError);
        expect(error.create).toHaveBeenCalledWith({
            name: 'MISSING_PARAM',
            message: 'The required parameter is missing.',
            notifyOff: true
        });
    });

    it('should return true when param is provided', () => {
        const result = validateModule.validate('value');
        expect(result).toBe(true);
    });
});
