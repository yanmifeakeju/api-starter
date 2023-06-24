import { Job, Worker } from 'bullmq';

const worker = new Worker('foo', async (job: Job) => {
  console.log(job.data);
});

worker.on('completed', (job) => {
  console.log(`${job.id} has completed`);
});

worker.on('failed', (job) => {
  console.log(`${job?.id} has failed`);
});
