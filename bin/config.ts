
const env: string | undefined = process.env.NODE_ENV;
const region: string | undefined = process.env.CDK_DEPLOY_REGION;
const account: string | undefined = process.env.CDK_DEPLOY_ACCOUNT;

export interface VpcConfig {
    cidr: string;
    subnetPublicName: string;
    subnetPrivateName: string;
    subnetPublicCidrMask: number;
    subnetPrivateCidrMask: number;
    natGateways: number;
}

export interface Config {
    host: string;
    awsConsole: string;
    vpc: VpcConfig;
}

function assert(value: any): any {
    if (!value) {
        throw new Error("Invalid string input");
    }
    return value;
}

export function getConfig(): Config {
    return {
        host: assert(process.env.HOST),
        awsConsole: assert(process.env.AWS_CONSOLE),
        vpc: {
            cidr: assert(process.env.VPC_CIDR),
            subnetPublicName: assert(process.env.VPC_SUBNET_PUBLIC_NAME),
            subnetPrivateName: assert(process.env.VPC_SUBNET_PRIVATE_NAME),
            subnetPublicCidrMask: Number(assert(process.env.VPC_SUBNET_PUBLIC_CIDR_MASK)),
            subnetPrivateCidrMask: Number(assert(process.env.VPC_SUBNET_PRIVATE_CIDR_MASK)),
            natGateways: Number(assert(process.env.VPC_NAT_GATEWAYS)),
        }
    };
}

export const configPropsDev: { [key: string]: { [key: string]: { [key: string]: any } } } = {
    'us-east-1': {
        '009963118558': {

        },
        '083258740834': {

        }
    },
    'us-west-2': {
        '009963118558': {

        },
        '083258740834': {

        }
    }
};

export const configPropsStag: { [key: string]: { [key: string]: { [key: string]: any } } } = {
    'us-east-1': {
        '009963118558': {

        },
        '083258740834': {

        }
    },
    'us-west-2': {
        '009963118558': {

        },
        '083258740834': {

        }
    }
};

export const configPropsProd: { [key: string]: { [key: string]: { [key: string]: any } } } = {
    'us-east-1': {
        '009963118558': {

        },
        '083258740834': {

        }
    },
    'us-west-2': {
        '009963118558': {

        },
        '083258740834': {

        }
    }
};

export const configProps: { [key: string]: { [key: string]: { [key: string]: { [key: string]: any } } } } = {
    development: configPropsDev,
    staging: configPropsStag,
    production: configPropsProd
};
