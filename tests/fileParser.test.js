jest.mock('N/file');
jest.mock('N/error');
jest.mock('N/log');

const file = require('N/file');
const error = require('N/error');
const log = require('N/log');

describe('fileParser', () => {
    let mockCsvFile, mockInvoiceFile, mockLines, iterator;

    beforeAll(() => {
        global.define = jest.fn((deps, factory) => {
            factory(file, error, log);
        });
    });

    beforeEach(() => {
        jest.resetModules(); // Ensures fresh module state for every test
        jest.clearAllMocks();
        mockCsvFile = {
            appendLine: jest.fn(),
            save: jest.fn(() => 123)
        };
        file.create = jest.fn(() => mockCsvFile);

        mockLines = [
            { value: 'date,amount' },
            { value: '10/21/14,200.0' },
            { value: '10/21/15,210.2' },
            { value: '10/21/16,250.3' }
        ];
    });

    function setupIterator() {
        let callCount = 0;

        iterator = {
            each: jest.fn(callback => {
                callCount++;

                if (callCount === 1) {
                    // First call to iterator.each: simulate skipping the header
                    callback(mockLines[0]);
                    return false;
                } else {
                    // Second call: process each data line
                    for (let i = 1; i < mockLines.length; i++) {
                        const shouldContinue = callback(mockLines[i]);
                        if (!shouldContinue) break;
                    }
                    return true;
                }
            })
        };

        mockInvoiceFile = {
            lines: {
                iterator: () => iterator
            }
        };

        file.load = jest.fn(() => mockInvoiceFile);
    }

    it('should create and save a CSV file with correct content', () => {
        setupIterator();
        require('../scripts/fileParser');
        expect(file.create).toHaveBeenCalledWith(expect.objectContaining({
            name: 'data.csv',
            fileType: 'CSV',
            contents: expect.stringContaining('date,amount')
        }));
        expect(mockCsvFile.appendLine).toHaveBeenCalledTimes(3);
        expect(mockCsvFile.save).toHaveBeenCalled();
        expect(file.load).toHaveBeenCalledWith({ id: 123 });
    });

    it('should process all data lines and not throw for valid numbers', () => {
        setupIterator();
        error.create = jest.fn(() => { throw new Error('Should not be called'); });
        expect(() => require('../scripts/fileParser')).not.toThrow();
        expect(error.create).not.toHaveBeenCalled();
    });

    describe('error scenario', () => {
        beforeEach(() => {
            mockLines.length = 0;
            mockLines.push(
                { value: 'date,amount' },
                { value: '10/21/14,200.0' },
                { value: '10/21/15,notanumber' },
                { value: '10/21/16,250.3' }
            );
            const mockNetSuiteError = new Error('Invoice file contained non-numeric value for total: notanumber');
            mockNetSuiteError.name = 'INVALID_INVOICE_FILE';
            error.create = jest.fn(() => { throw mockNetSuiteError; });
            delete require.cache[require.resolve('../scripts/fileParser')];
        });
        it('should throw error for non-numeric amount', () => {
            setupIterator();
            expect(() => require('../scripts/fileParser')).toThrow('Invoice file contained non-numeric value for total: notanumber');
 
        });
    });
});