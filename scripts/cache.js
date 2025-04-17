/**
 * @NScriptType Suitelet
 * @NApiVersion 2.x
 */
define(['N/cache', '../__mocks__/SuiteScripts/zipCodes/ca/zipToCityIndexCacheLoader', 'N/log'],
    function (cache, lib, log) {
        const ZIP_CODES_CACHE_NAME = 'ZIP_CODES_CACHE';
        const ZIP_TO_CITY_IDX_JSON = 'ZIP_TO_CITY_IDX_JSON';

        function getZipCodeToCityLookupObj() {
            try {
                var zipCache = cache.getCache({
                    name: ZIP_CODES_CACHE_NAME,
                    scope: cache.Scope.PROTECTED
                });
                var zipCacheJson = zipCache.get({
                    key: ZIP_TO_CITY_IDX_JSON,
                    loader: lib.zipCodeDatabaseLoader
                });
                return JSON.parse(zipCacheJson);
            } catch (e) {
                log.error({
                    title: 'Cache Load Error',
                    details: 'Failed to load ZIP code cache: ' + e.message
                });
                throw new Error('Failed to load ZIP code cache');
            }
        }

        function findCityByZipCode(options) {
            return getZipCodeToCityLookupObj()[String(options.zip)];
        }

        function onRequest(context) {
            try {
                var response = context.response;
                var parameters = context.request.parameters;

                if (parameters.purgeZipCache === 'true') {
                    var zipCache = cache.getCache({
                        name: ZIP_CODES_CACHE_NAME,
                        scope: cache.Scope.PROTECTED
                    });
                    zipCache.remove({ key: ZIP_TO_CITY_IDX_JSON });
                    log.audit('Cache Purged', 'ZIP code cache cleared');
                }

                var zipCode = parameters.zipcode;
                if (!zipCode) {
                    response.writeLine('Error: zipcode parameter is required');
                    return;
                }
                if (!/^\d{5}$/.test(zipCode)) {
                    response.writeLine('Error: Invalid ZIP code format');
                    return;
                }

                var cityName = findCityByZipCode({ zip: zipCode });
                response.writeLine(cityName || 'Unknown :(');

            } catch (e) {
                log.error({
                    title: 'Suitelet Error',
                    details: e.message
                });
                response.writeLine('Error: ' + e.message);
            }
        }

        return {
            onRequest: onRequest
        };
    });