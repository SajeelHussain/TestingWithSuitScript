/**
 * @NApiVersion 2.x
 */
define(['N/action', 'N/record'], function(action, record) {
    function createAndApproveTimebill() {
        var rec = record.create({
            type: 'timebill',
            isDynamic: true
        });

        rec.setValue({ fieldId: 'employee', value: 104 });
        rec.setValue({ fieldId: 'location', value: 312 });
        rec.setValue({ fieldId: 'hours', value: 5 });

        var recordId = rec.save();

        var actions = action.find({
            recordType: 'timebill',
            recordId: recordId
        });

        if (actions.approve) {
            actions.approve();
            return 'Timebill approved';
        } else {
            return 'Already approved';
        }
    }

    return {
        createAndApproveTimebill: createAndApproveTimebill
    };
});
