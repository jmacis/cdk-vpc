
// Structure for tagging objects created
interface Tag {
    name: string;
    value: string;
}

export const stackTags: { name: string, value: string }[] = [
    { name: 'AppName', value: 'test-vpc-app' },
    { name: 'CostCenter', value: '1000' },
    { name: 'StackName', value: 'CDK-VPC-APP' },
    { name: 'StackOwner', value: 'John Macis' },
    { name: 'Env', value: 'Development' }
];