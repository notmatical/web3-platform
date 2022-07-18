import { FormikValues } from 'formik';

export type ProposalsProps = {
    id: string;
    title: string;
    description: string;
    tags: string[];
    status: boolean;
    type: boolean;
    created: Date;
    end: Date;
};

export interface ProposalStateProps {
    proposals: FormikValues[];
    error: object | string | null;
}
