const currency = require('N/currency');
jest.mock('N/currency');

let currencyConverter;

beforeAll(() => {
    global.define = jest.fn((deps, factory) => {
        currencyConverter = factory(...deps.map(dep => require(dep)));
    });
    require('../scripts/currencyConverter');
});

describe('convertCurrency', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        currency.exchangeRate = jest.fn();
    });

    it('Should convert CAD to USD correctly using the exchange rate', () => {
        const mockRate = 0.75;
        currency.exchangeRate.mockReturnValue(mockRate);

        const result = currencyConverter.getUSDFromCAD(100, new Date('2015-07-28'));

        expect(currency.exchangeRate).toHaveBeenCalledWith({
            source: 'CAD',
            target: 'USD',
            date: new Date("2015-07-28")
        });

        expect(result).toBe(75);
    });

    it('should return 0 when amount is 0', () => {
        const result = currencyConverter.getUSDFromCAD(0, new Date('2015-07-28'));
        expect(result).toBe(0);
    });
});