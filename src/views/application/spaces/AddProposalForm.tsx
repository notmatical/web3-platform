// material-ui
import { Avatar, Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, Typography, Alert } from '@mui/material';
import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

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
    space: any;
    handleCreate: (d: FormikValues) => void;
    onCancel: () => void;
}

const AddProposalForm = ({ space, handleCreate, onCancel }: AddProposalFormProps) => {
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

    const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

    return (
        <FormikProvider value={formik}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <DialogTitle>Creating Proposal ({space.name})</DialogTitle>
                    <Divider />
                    <DialogContent sx={{ p: 3 }}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Alert variant="outlined" severity="info">
                                    You need to actively hold an NFT in order to submit a proposal.
                                </Alert>
                            </Grid>

                            {/* Collection Image */}
                            <Grid item xs={4}>
                                <Avatar
                                    src={space.avatar}
                                    alt="Space Image"
                                    sx={{
                                        borderRadius: '16px',
                                        width: { xs: 72, sm: 100, md: 172 },
                                        height: { xs: 72, sm: 100, md: 172 }
                                    }}
                                />
                            </Grid>

                            {/* Proposal Title/Discussion */}
                            <Grid item xs={8}>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    {...getFieldProps('title')}
                                    error={Boolean(touched.title && errors.title)}
                                    helperText={touched.title && errors.title}
                                    sx={{ mb: 3 }}
                                />

                                <TextField
                                    fullWidth
                                    label="Discussion (Optional)"
                                    {...getFieldProps('discussion')}
                                    error={Boolean(touched.discussion && errors.discussion)}
                                    helperText={touched.discussion && errors.discussion}
                                />
                                <Typography variant="caption" display="block" sx={{ ml: 2 }}>
                                    Provide a link to a discussion page regarding this proposal.
                                </Typography>
                            </Grid>

                            {/* Proposal Description */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={5}
                                    label="Description"
                                    {...getFieldProps('body')}
                                    error={Boolean(touched.body && errors.body)}
                                    helperText={touched.body && errors.body}
                                />
                                <Typography variant="caption" display="block" sx={{ ml: 2 }}>
                                    Describe in detail the reasoning behind your proposal.
                                </Typography>
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions sx={{ p: 3 }}>
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Button type="submit" variant="contained" color="secondary" fullWidth disabled={isSubmitting}>
                                Submit
                            </Button>
                        </Grid>
                    </DialogActions>
                </Form>
            </LocalizationProvider>
        </FormikProvider>
    );
};

export default AddProposalForm;
