import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CustomApiGateway } from "./apigateway";
import { CustomDatabase } from "./database";
import { CustomEventBus } from "./eventbus";
import { CustomMicroservices } from "./microservice";
import { CustomQueue } from "./queue";

export class AwsMicroservicesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const database = new CustomDatabase(this, "Database");

    const microservices = new CustomMicroservices(this, "Microservices", {
      productTable: database.productTable,
      basketTable: database.basketTable,
      orderTable: database.orderTable,
    });

    const apigateway = new CustomApiGateway(this, "ApiGateway", {
      productMicroservice: microservices.productMicroservice,
      basketMicroservice: microservices.basketMicroservice,
      orderingMicroservices: microservices.orderingMicroservice,
    });

    const queue = new CustomQueue(this, "Queue", {
      consumer: microservices.orderingMicroservice,
    });

    const eventbus = new CustomEventBus(this, "EventBus", {
      publisherFuntion: microservices.basketMicroservice,
      targetQueue: queue.orderQueue,
    });
  }
}
