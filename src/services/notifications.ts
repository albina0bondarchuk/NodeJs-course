import AWS from "aws-sdk";

AWS.config.update({
  region: "us-east-1",
  accessKeyId: "AKIAXI75V4FARHJEXSGD",
  secretAccessKey: "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",
});

const sqs = new AWS.SQS();
const queueUrl =
  "https://sqs.us-east-1.amazonaws.com/500358832449/notifications.fifo";

export const sendNotification = async (notification: any) => {
  const params = {
    MessageBody: JSON.stringify(notification),
    MessageGroupId: `messages${notification.creator}`,
    QueueUrl: queueUrl,
  };

  await sqs.sendMessage(params).promise();
};
