#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { PrototypeAwsCdkEc2SpotNatInstanceStack } from '../lib/prototype-aws-cdk-ec2-spot-nat-instance-stack';

const app = new cdk.App();
new PrototypeAwsCdkEc2SpotNatInstanceStack(app, 'PrototypeAwsCdkEc2SpotNatInstanceStack');
