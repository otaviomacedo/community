import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import { IntegTest, IntegTestCase } from '@aws-cdk/integ-tests';

const app = new App();

interface  MyApplicationStackProps extends StackProps{
  readonly encrypted?: boolean;
}
class MyApplicationStack extends Stack {
  constructor(scope: Construct, id: string, props?: MyApplicationStackProps) {
    super(scope, id, props);

    new s3.Bucket(this, 'Bucket', {
      encryption: props?.encrypted ? s3.BucketEncryption.S3_MANAGED: undefined,
    });
  }
}

new MyApplicationStack(app, 'stackUnderTest');

const integrationTestStack = new Stack(app, 'integrationTestStack');

const withoutEncryption = new IntegTestCase(integrationTestStack, 'without-encryption', {
  stacks: [
    new MyApplicationStack(app, 'without-encryption'),
  ],
});

// const withEncryption = new IntegTestCase(integrationTestStack, 'with-encryption', {
//   stacks: [
//     new MyApplicationStack(app, 'with-encryption',{
//       encrypted: true,
//     })
//   ],
// });

new IntegTest(app, 'asdas', {
  testCases: [withoutEncryption]
});

