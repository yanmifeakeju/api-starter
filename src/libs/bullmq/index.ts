import { type Processor, Worker } from 'bullmq';
import { Queue } from 'bullmq';

import { Redis } from 'ioredis';

const redis = new Redis({ maxRetriesPerRequest: null });

export const createJobHandler = (jobName: string) => {
  return new Queue(jobName, { connection: redis });
};

export const createWorkerHandler = (jobName: string, handler: Processor) => {
  const worker = new Worker(jobName, handler, { connection: redis });

  worker.on('completed', (job) => console.log(`${job.id} has completed`));
  worker.on('failed', (job) => console.log(`${job?.id} has failed`));
};
