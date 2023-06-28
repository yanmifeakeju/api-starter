import { Queue } from 'bullmq';

export const createJobHandler = (jobName: string) => {
  return new Queue(jobName);
};
