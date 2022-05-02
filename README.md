# shift-claims-queue-processor

RMQ message processor to persist in mongo DataStore API and enrich claim to global data store. 

This service listens on `Q_claims_inbound` and will be working in cluster mode and can be scaled as per the need of consumers.
Future Scope : Dynamic Scaling as per queue size

### Feature : processMessage
  
@desc Message Processor Handler
[1] Check if the uniqueID is already processed and present in Global Cache Store
[2] Persist the claim message with the DataAdapter API
[3] Enrich the Global Cache Store
[4] ACK the message

## Setup ENV

```REDIS_URI={REDIS_HOST_URI}``` 
default 'redis://:92bmwmvtwma7hpdb3tjzgbdcntfkmmgz@swift-hemlock-0772066f5b.redisgreen.net:11042/'

```DATA_API_KEY={DATA_API_KEY}``` 
default '8wv2geCjMXCAKAmL9vUSoaiXDOVZ2t2mz5EZHRhUPVxnUH9jo1gyRtR4yFAQV2DD'


## Starting the application
```
npm i
npm run start
```

Expected Output :
```
# npm run start   
> shift-claims-queue-processor@v1.0.0 start
> node --trace-deprecation ./bin/server
```

## Debugging the application
npm run debug

## Test : Jest
```
> npm test
```

## Coverage : Jest
```
> npm run coverage
```

## Dev Credentials

RMQ : CloudAMQP
```
chinook.rmq.cloudamqp.com (Load balanced) 
chinook-01.rmq.cloudamqp.com

UserName: jdksxkpr
Password: dH7lvZjqGt-6XEahnupT88S3WzRgzyns
```

REDIS : RedisGreen Cloud 
```
redis-cli -h swift-hemlock-0772066f5b.redisgreen.net -p 11042 -a 92bmwmvtwma7hpdb3tjzgbdcntfkmmgz
```


