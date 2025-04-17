jest.mock('N/record');
jest.mock('N/action');

const record = require('N/record');
const action = require('N/action');

let timebillScript;

beforeAll(async () => {
    // Mocking define() to simulate the AMD loading behavior
    global.define = jest.fn((deps, factory) => {
        // Manually call the factory with mocked dependencies
        timebillScript = factory(...deps.map(dep => require(dep)));
    });

    // Trigger the module load by requiring it
    require('../scripts/timebill'); // This will now trigger our mock `define`
});

describe('createAndApproveTimebill', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a timebill and approve it', () => {
        // Setup mock for record.create
        const mockRecord = {
            setValue: jest.fn(),
            save: jest.fn(() => 123) // returning record ID
        };

        // Mock record.create to return our mock record
        record.create.mockReturnValue(mockRecord);

        // Setup action mock with approve
        const mockActions = {
            approve: jest.fn()
        };
        action.find.mockReturnValue(mockActions);

        const result = timebillScript.createAndApproveTimebill();

        expect(record.create).toHaveBeenCalledWith({ type: 'timebill', isDynamic: true });
        expect(mockRecord.setValue).toHaveBeenCalledTimes(3);
        expect(mockRecord.save).toHaveBeenCalled();
        expect(action.find).toHaveBeenCalledWith({ recordType: 'timebill', recordId: 123 });
        expect(mockActions.approve).toHaveBeenCalled();
        expect(result).toBe('Timebill approved');
    });

    it('should handle already approved timebill', () => {
        // Setup mock for record.create
        const mockRecord = {
            setValue: jest.fn(),
            save: jest.fn(() => 456) // returning record ID
        };

        // Mock record.create to return our mock record
        record.create.mockReturnValue(mockRecord);

        // Setup action mock without approve
        const mockActions = {}; // no approve method
        action.find.mockReturnValue(mockActions);

        const result = timebillScript.createAndApproveTimebill();

        expect(record.create).toHaveBeenCalled();
        expect(action.find).toHaveBeenCalledWith({ recordType: 'timebill', recordId: 456 });
        expect(result).toBe('Already approved');
    });
});
