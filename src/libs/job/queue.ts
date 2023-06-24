import { Queue } from 'bullmq';

const myQueue = new Queue('foo');

async function addJobs() {
  await myQueue.add('test-job', { foo: 'bar' }, { jobId: '1Q' });
  await myQueue.add('test-job', { quz: 'baz' }, { jobId: '1Q' });
}

await addJobs();
