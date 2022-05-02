const { GlobalCache, DataAdapter } = require('../adapters')

class ClaimProcessor {
    constructor({ state = {}, config = {} }) {
        /** Future Overrides */
        this.state = state;
        this.config = state;
        this.globalCache = new GlobalCache({ state, config });
        this.dataAdapter = new DataAdapter();
    }

    handler = async (claim) => {
        /**
         * @desc Message Processor Handler
         * [1] Check if the uniqueID is already processed and present in Global Cache Store
         * [2] Persist the claim message with the DataAdapter API
         * [3] Enrich the Global Cache Store
         * [4] ACK the message
         */
        try {
            const exists = await this.globalCache.getClaim(claim.orgID, claim.uniqueID);
            if (!exists) {
                await this.dataAdapter.saveClaim(claim.orgID, claim.uniqueID, claim.claimName, claim.verified);
            }
            await this.globalCache.setClaim(claim.orgID, claim.uniqueID, claim);
            return true
        } catch (exception) {
            throw exception
        }
    }

}
module.exports = ClaimProcessor
