import { Processor, Worker } from 'bullmq';

export const createWorkerHandler = (jobName: string, handler: Processor) => {
  const worker = new Worker(jobName, handler);

  worker.on('completed', (job) => console.log(`${job.id} has completed`));
  worker.on('failed', (job) => console.log(`${job?.id} has failed`));
};
