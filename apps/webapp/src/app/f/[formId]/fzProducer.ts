import { Queue } from "bullmq";

const queueName = "fz_actions";
const bullConfig = {
  connection: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
    ...(!process.env.REDIS_URI?.includes("127.0") && { tls: {} }),
    ...(process.env.REDIS_PWD && {
      password: process.env.REDIS_PWD,
    }),
  },
  prefix: `{${process.env.NODE_ENV === "production" ? "prod" : "dev"}}-{fz}`,
};

const fzQueue = new Queue(queueName, bullConfig);

interface IFzProducerData {
  eventName: string;
  eventData: {
    [key: string]: any;
  };
}

export default async function (data: IFzProducerData) {
  let producerResp = {};

  try {
    const response = await fzQueue.add(queueName, data, {
      removeOnFail: { count: 15 },
      removeOnComplete: { count: 5 },
    });

    producerResp = {
      success: true,
      message: `Data added to the ${queueName} with Id: ${response?.id}`,
    };
  } catch (e: any) {
    producerResp = {
      success: false,
      message: `Failed to add data to ${queueName} due to ${e?.message}`,
    };
  }

  return producerResp;
}
