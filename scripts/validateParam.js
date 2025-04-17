define(['N/error'], function(error){
    function validate(param){
        if(!param){
            throw error.create({
                name: 'MISSING_PARAM',
                message: 'The required parameter is missing.',
                notifyOff: true
            });
        }
        return true;
    }
    return { validate };
});