
// structure for tagging objects created
interface Tag {
    name: string;
    value: string;
}

export const stackTagsDev: { name: string, value: string }[] = [
    { name: 'AppName', value: 'test-vpc' },
    { name: 'CostCenter', value: '1000' },
    { name: 'StackName', value: 'CDK-VPC' },
    { name: 'StackOwner', value: 'John Macis' },
    { name: 'Env', value: 'Development' }
];

export const stackTagsStag: { name: string, value: string }[] = [
    { name: 'App_Name', value: 'test-vpc' },
    { name: 'CostCenter', value: '2000' },
    { name: 'StackName', value: 'CDK-VPC' },
    { name: 'StackOwner', value: 'John Macis' },
    { name: 'Env', value: 'Staging' }
];

export const stackTagsProd: { name: string, value: string }[] = [
    { name: 'App_Name', value: 'test-vpc' },
    { name: 'CostCenter', value: '3000' },
    { name: 'StackName', value: 'CDK-VPC' },
    { name: 'StackOwner', value: 'John Macis' },
    { name: 'Env', value: 'Production' }
];

// stack tags
export const stackTags: { [name: string]: { name: string, value: string }[] } = {
    development: stackTagsDev,
    staging: stackTagsStag,
    production: stackTagsProd
};