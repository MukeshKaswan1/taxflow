import test from 'node:test';
import assert from 'node:assert';

// Define the query construction logic matching streamJobEvents in eventController.js
const buildReplayQuery = (jobId, lastEventIdHeader) => {
  const lastEventId = parseInt(lastEventIdHeader, 10);
  let query = { jobId };
  if (lastEventIdHeader !== undefined && !isNaN(lastEventId)) {
    query.seq = { $gt: lastEventId };
  }
  return query;
};

test('Event Replay Logic Tests', () => {
  test('should return base query without seq filter when last-event-id is not provided', () => {
    const query = buildReplayQuery('job123', undefined);
    assert.deepStrictEqual(query, { jobId: 'job123' });
  });

  test('should return base query without seq filter when last-event-id is invalid', () => {
    const query = buildReplayQuery('job123', 'invalid-number');
    assert.deepStrictEqual(query, { jobId: 'job123' });
  });

  test('should return query with $gt filter when last-event-id is a valid integer', () => {
    const query = buildReplayQuery('job123', '5');
    assert.deepStrictEqual(query, { jobId: 'job123', seq: { $gt: 5 } });
  });
});
