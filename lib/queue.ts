import { Duration } from "aws-cdk-lib";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { IQueue, Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

interface CustomQueueProps {
  consumer: IFunction;
}

export class CustomQueue extends Construct {
  public readonly orderQueue: IQueue;

  constructor(scope: Construct, id: string, props: CustomQueueProps) {
    super(scope, id);

    //queue
    this.orderQueue = new Queue(this, "OrderQueue", {
      queueName: "OrderQueue",
      visibilityTimeout: Duration.seconds(30),
    });

    props.consumer.addEventSource(
      new SqsEventSource(this.orderQueue, {
        batchSize: 1,
      }),
    );
  }
}
