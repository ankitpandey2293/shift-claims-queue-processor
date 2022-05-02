#!/usr/bin/env node

/**
 * Module dependencies.
 */

const { ClaimProcessor } = require('../src/processor');
const QueuePublisher = require('../src/adapters/queue.publisher.adapter')
const debug = require('debug')('shift-claims-queue-processor:server');

const claimProcessor = new ClaimProcessor({})
const queuePublisher = new QueuePublisher(claimProcessor.handler);
queuePublisher.setupConnection().then(() => {
    queuePublisher.receive()
})


