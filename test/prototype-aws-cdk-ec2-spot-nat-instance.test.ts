import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import PrototypeAwsCdkEc2SpotNatInstance = require('../lib/prototype-aws-cdk-ec2-spot-nat-instance-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new PrototypeAwsCdkEc2SpotNatInstance.PrototypeAwsCdkEc2SpotNatInstanceStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
