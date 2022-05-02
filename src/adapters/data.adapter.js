require('dotenv').config()
const axios = require('axios');
const config = {
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': process.env.DATA_API_KEY || '8wv2geCjMXCAKAmL9vUSoaiXDOVZ2t2mz5EZHRhUPVxnUH9jo1gyRtR4yFAQV2DD'
    },
    dataSource: 'shift',
    collection: 'claimsmaster'
}

const OperationMap = {
    insertOne: (orgID, uniqueID, claimName, verified) => {
        return {
            method: 'post',
            url: 'https://data.mongodb-api.com/app/data-aqora/endpoint/data/beta/action/insertOne',
            headers: config.headers,
            data: JSON.stringify({
                collection: config.collection,
                database: `org${orgID}_claims`,
                dataSource: config.dataSource,
                document: {
                    uniqueID,
                    claimName,
                    verified
                }
            })
        }
    }
}

class DataAdapter {
    constructor() {
        this.config = config
    }

    async saveClaim(orgID, uniqueID, claimName, verified) {
        return new Promise((resolve, reject) => {
            axios(OperationMap.insertOne(orgID, parseInt(uniqueID), claimName, verified))
                .then(response => {
                    resolve(response.data.insertedId)
                }).catch(error => {
                    /** Assuming error scenario to be Duplicate Key
                     * FUTURE_PIPELINE : Check error codes and have failover if not E11000: Duplicate
                     */
                    reject('Claim already exists')
                })
        })

    }
}

module.exports = DataAdapter