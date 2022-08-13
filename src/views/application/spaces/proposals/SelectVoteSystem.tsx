// material-ui
import { Button, DialogContent, DialogTitle, Divider, Grid, Typography, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';

// project imports
import { gridSpacing } from 'store/constant';

// constant
const getInitialValues = () => {
    const newProject = {
        title: '',
        body: '',
        discussion: null
    };

    return newProject;
};

// ==============================|| CREATE PROJECT ||============================== //

interface AddProposalFormProps {
    handleCreate: (d: FormikValues) => void;
    onCancel: () => void;
}

const SelectVoteSystem = ({ handleCreate, onCancel }: AddProposalFormProps) => {
    const ProposalSchema = Yup.object().shape({
        title: Yup.string().max(255).required('Please specify a title for this proposal.'),
        body: Yup.string().max(2000).required('Please include a description for this proposal.'),
        discussion: Yup.string().max(510).nullable()
    });

    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: ProposalSchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                const data = {
                    title: values.title,
                    body: values.body,
                    discussion: values.discussion
                };

                handleCreate(data);

                resetForm();
                onCancel();
                setSubmitting(false);
            } catch (error) {
                console.error(error);
            }
        }
    });

    const { handleSubmit } = formik;

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <DialogTitle>Select Voting System</DialogTitle>
                <Divider />
                <DialogContent sx={{ p: 3 }}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                color="primary"
                                fullWidth
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    flexDirection: 'column',
                                    borderStyle: 'solid',
                                    borderColor: '#e5e7eb'
                                }}
                            >
                                <CheckCircleIcon htmlColor="#fff" sx={{ position: 'absolute', right: '8px', top: '8px' }} />
                                <Typography variant="h3" sx={{ mb: 0.5 }}>
                                    Single Choice Voting
                                </Typography>
                                <Typography color="primary" variant="subtitle2">
                                    Each voter may select only one choice.
                                </Typography>
                            </Button>
                            <Button variant="outlined" color="primary" fullWidth sx={{ p: 2, flexDirection: 'column', mb: 2 }}>
                                <Typography variant="h3" sx={{ mb: 0.5 }}>
                                    Approval Voting
                                </Typography>
                                <Typography color="primary" variant="subtitle2">
                                    Each voter may select any number of choices.
                                </Typography>
                            </Button>
                            <Button variant="outlined" color="primary" fullWidth sx={{ p: 2, flexDirection: 'column', mb: 2 }}>
                                <Typography variant="h3" sx={{ mb: 0.5 }}>
                                    Basic Voting
                                </Typography>
                                <Typography color="primary" variant="subtitle2">
                                    Single choice voting with three choices.
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Form>
        </FormikProvider>
    );
};

export default SelectVoteSystem;
