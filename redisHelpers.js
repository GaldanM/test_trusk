const Redis = require('ioredis');
const redis = new Redis(6379, '172.17.0.2');

function setKey(key, value) {
	return redis.set(key, value);
}
function getKey(key) {
	return redis.get(key);
}

function addToSet(set, value) {
	return redis.sadd(set, value);
}
function getSet(set) {
	return redis.smembers(set);
}

function flushAll() {
	return redis.flushall();
}

module.exports = {
	setKey, getKey,
	addToSet, getSet,
	flushAll,
}
