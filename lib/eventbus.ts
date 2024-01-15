import { EventBus, Rule } from "aws-cdk-lib/aws-events";
import { SqsQueue } from "aws-cdk-lib/aws-events-targets";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { IQueue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

interface CustomEventBusProps {
  publisherFuntion: IFunction;
  targetQueue: IQueue;
}

export class CustomEventBus extends Construct {
  constructor(scope: Construct, id: string, props: CustomEventBusProps) {
    super(scope, id);

    //eventbus
    const bus = new EventBus(this, "CustomEventBus", {
      eventBusName: "CustomEventBus",
    });

    const checkoutBasketRule = new Rule(this, "CheckoutBasketRule", {
      eventBus: bus,
      enabled: true,
      description: "When Basket microservice checkout the basket",
      eventPattern: {
        source: ["com.Custom.basket.checkoutbasket"],
        detailType: ["CheckoutBasket"],
      },
      ruleName: "CheckoutBasketRule",
    });

    // need to pass target to Ordering Lambda service
    checkoutBasketRule.addTarget(new SqsQueue(props.targetQueue));

    bus.grantPutEventsTo(props.publisherFuntion);
    // AccessDeniedException - is not authorized to perform: events:PutEvents
  }
}
