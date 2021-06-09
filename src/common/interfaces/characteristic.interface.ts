export interface ICharacteristic {
    name: string;
    value: string;
    unit: string;
    dataType: string;
    label?: string;
    system?: boolean;
    id?: number;
    status?: string;
    unitRequired: boolean;
}
