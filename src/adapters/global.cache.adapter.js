const { createClient } = require('redis');
let redisToggle = false;
/** Healthcheck */
exports.isRedisReady = redisToggle;


/** TODO : This will be shifted to ENV or Configuration Management */
const ConnectionConfig = {
    URI: 'redis://:92bmwmvtwma7hpdb3tjzgbdcntfkmmgz@swift-hemlock-0772066f5b.redisgreen.net:11042/',
    socket: {
        connectTimeout: 5000,
        keepAlive: 20000
    },
    claimsExpiry: 60 * 60
}

class GlobalCache {
    constructor({ state = {}, config = {} }) {
        this.config = config;
        this.state = state;
        this.retryAttempts = 0;
        this.client = createClient({ url: ConnectionConfig.URI, socket: ConnectionConfig.socket })

        this.client.on('error', this.errorHandler);
        this.client.on('connect', () => { redisToggle = true });
        this.client.on('ready', () => { redisToggle = true });
        this.init();
    }
    /** 
     * @desc  Initialize Cache Adapter
    */
    init = async () => {
        await this.client.connect();
    }

    /** 
     * @desc  Close Cache Adapter
    */
    close = async () => {
        await Promise.allSettled([
            this.client.quit(),
            this.client.disconnect()
        ])
    }

    /** 
     * @desc ReConnection Error Handler 
     * */
    errorHandler = async (err) => {
        const me = this;
        redisToggle = false
        this.retryAttempts++;
        if (this.retryAttempts <= 10) {
            console.log(`Redis RetryAttempt ${this.retryAttempts}`)
            await me.init()
        } else {
            throw new Error('Trouble connecting global cache store')
        }
    }

    /**
     * @desc Retrieve a unique claim from Global Cache Store
     * @param {orgID} organizationID
     * @param {uniqueID} uniqueID sent by user while requesting a unique claim 
     * */
    getClaim = async (orgID, uniqueID) => {
        const key = `${orgID}:CL:${uniqueID}`
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null
    }

    /**
     * @desc Save a unique claim from Global Cache Store
     * @param {orgID} organizationID
     * @param {uniqueID} uniqueID sent by user while requesting a unique claim
     * @param {orgID} orgID sent by user while requesting a unique claim
     * @param {claim} claim retrieved from secondary storage 
     * */
    setClaim = async (orgID, uniqueID, claim) => {
        const key = `${orgID}:CL:${uniqueID}`
        delete claim['_id']
        const [setNxReply] = await this.client
            .multi()
            .setNX(key, JSON.stringify(claim))
            .setEx(key, ConnectionConfig.claimsExpiry, JSON.stringify(claim))
            .exec();

        return setNxReply
    }


    /** 
     * @desc Delete a specified key from Global Cache 
     * @param {key} key
     * */
    deleteKey = async (key) => {
        await this.client.del(key)
    }
}

module.exports = GlobalCache