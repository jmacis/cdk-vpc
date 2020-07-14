// structure for tagging objects created
interface Tag {
    name: string;
    value: string;
}

export const stackTags: { name: string, value: string }[] = [
    { name: 'App_Name', value: 'test-vpc-app' },
    { name: 'CostCenter', value: '2000' },
    { name: 'StackName', value: 'CDK-VPC-APP' },
    { name: 'StackOwner', value: 'John Macis' },
    { name: 'Env', value: 'Production' }
]