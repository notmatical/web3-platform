import { FormikValues } from 'formik';

export type SpacesProps = {
    id: string;
    avatar: string;
    name: string;
    symbol: string;
    members: number;
};

export interface SpaceStateProps {
    spaces: FormikValues[];
    error: object | string | null;
}
