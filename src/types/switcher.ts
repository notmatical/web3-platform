import { KeyedObject } from 'types';

export interface SwitcherCardProps extends KeyedObject {
    mint: string;
    role: string;
    name: string;
    image: string;
    item: any;
    startLoading: Function;
    stopLoading: Function;
    updatePage: Function;
}
