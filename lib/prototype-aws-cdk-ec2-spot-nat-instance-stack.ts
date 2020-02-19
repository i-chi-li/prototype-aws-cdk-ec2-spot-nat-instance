import * as cdk from '@aws-cdk/core';
import {CfnInstanceProfile, PolicyDocument, PolicyStatement, Role, ServicePrincipal} from "@aws-cdk/aws-iam";
import {CfnLaunchTemplate, CfnSpotFleet, SecurityGroup, Vpc} from "@aws-cdk/aws-ec2";
import {readFileSync} from "fs";

export class PrototypeAwsCdkEc2SpotNatInstanceStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Constants
        const s3BucketName = this.node.tryGetContext("bucket");
        const amiImage = "ami-00d29e4cb217ae06b";
        const keyName = this.node.tryGetContext("key");
        const vpc = this.node.tryGetContext("vpc");
        const subnet1 = this.node.tryGetContext("subnet1");
        const subnet2 = this.node.tryGetContext("subnet2");

        // Security Group
        const ec2SecurtyGroup = new SecurityGroup(this, "EC2SecurityGroup", {
            description: "A Security Group that allows ingress access for SSH and the default port",
            vpc: Vpc.fromLookup(this, "VPC", {vpcId: vpc})
        });
        //ec2SecurtyGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(22), "from all SSH");

        // Role
        const ec2Role = new Role(this, "EC2Role", {
            assumedBy: new ServicePrincipal("ec2.amazonaws.com"),
            inlinePolicies: {
                EC2Policy: new PolicyDocument({
                    statements: [
                        new PolicyStatement({
                            actions: [
                                "s3:GetObject"
                            ],
                            resources: [
                                `arn:aws:s3:::${s3BucketName}/*`
                            ]
                        })
                    ]
                })
            }
        });

        // InstanceProfile
        const instanceProfile = new CfnInstanceProfile(this, "InstanceProfile", {
            path: "/",
            roles: [
                ec2Role.roleName
            ]
        });

        // User Data
        const userData = readFileSync("./userData.txt");

        // Launch Template
        const launchTemplate = new CfnLaunchTemplate(this, "LaunchTemplate", {
            launchTemplateName: "t3a_template",
            launchTemplateData: {
                blockDeviceMappings: [
                    {
                        deviceName: "/dev/xvda",
                        ebs: {
                            deleteOnTermination: true,
                            volumeType: "gp2",
                            volumeSize: 8
                        }
                    }
                ],
                iamInstanceProfile: {
                    name: instanceProfile.ref
                },
                imageId: amiImage,
                instanceType: "t3a.micro",
                keyName: keyName,
                networkInterfaces: [
                    {
                        associatePublicIpAddress: true,
                        deviceIndex: 0,
                        groups: [
                            ec2SecurtyGroup.securityGroupName
                        ]
                    }
                ],
                tagSpecifications: [
                    {
                        resourceType: "instance",
                        tags: [
                            {
                                key: "Name",
                                value: "NAT Instance"
                            }
                        ]
                    }
                ],
                userData: cdk.Fn.base64(userData.toString())
            }
        });

        // Spot Fleet
        const spotFleet = new CfnSpotFleet(this, "SpotFleet", {
            spotFleetRequestConfigData: {
                replaceUnhealthyInstances: true,
                targetCapacity: 1,
                type: "maintain",
                allocationStrategy: "diversified",
                iamFleetRole: `arn:aws:iam::${this.account}:role/aws-ec2-spot-fleet-tagging-role`,
                launchTemplateConfigs: [
                    {
                        launchTemplateSpecification: {
                            launchTemplateName: launchTemplate.launchTemplateName,
                            version: launchTemplate.attrLatestVersionNumber
                        },
                        overrides: [
                            {
                                subnetId: subnet1
                            }
                        ]
                    },
                    {
                        launchTemplateSpecification: {
                            launchTemplateName: launchTemplate.launchTemplateName,
                            version: launchTemplate.attrLatestVersionNumber
                        },
                        overrides: [
                            {
                                subnetId: subnet2
                            }
                        ]
                    }
                ]
            }
        });
    }
}
