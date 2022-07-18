import { KeyedObject } from 'types';

export type Projects = {
    id: string | number | undefined;
    image: string;
    name: string;
    floorPrice: number;
    avgSale: number;
    volume: number;
    listedCount?: number;
};

export interface ProjectStateProps {
    projects: Projects[];
    error: object | string | null;
}

export interface ProjectCardProps extends KeyedObject {
    image: string;
    name: string;
    description: string;
}
