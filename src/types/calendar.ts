import { FormikValues } from 'formik';

export type CalendarEventProps = {
    id: string;
    allDay: boolean;
    color: string;
    textColor?: string;
    description: string;
    start: Date;
    end: Date;
    title: string;
};

export interface CalendarStateProps {
    drops: FormikValues[];
    error: object | string | null;
}
