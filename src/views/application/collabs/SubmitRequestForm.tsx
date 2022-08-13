// material-ui
import {
    Avatar,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    TextField,
    Box,
    Radio,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel
} from '@mui/material';
import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';

// project imports
import { gridSpacing } from 'store/constant';

import DefaultUser from 'assets/images/placeholder.png';

// constant
const getInitialValues = () => {
    const newProject = {
        title: '',
        body: '',
        discussion: null
    };

    return newProject;
};

// ==============================|| SUBMIT REQUEST ||============================== //

interface SubmitRequestFormProps {
    project: any;
    handleCreate: (d: FormikValues) => void;
    onCancel: () => void;
}

const SubmitRequestForm = ({ project, handleCreate, onCancel }: SubmitRequestFormProps) => {
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
                    <DialogTitle>Submitting Collaboration Request</DialogTitle>
                    <Divider />
                    <DialogContent sx={{ p: 3 }}>
                        <Grid container spacing={gridSpacing}>
                            {/* Collection Image */}
                            <Grid item xs={4}>
                                <Avatar
                                    src={DefaultUser}
                                    alt="Space Image"
                                    sx={{
                                        borderRadius: '16px',
                                        width: { xs: 72, sm: 100, md: 178 },
                                        height: { xs: 72, sm: 100, md: 178 }
                                    }}
                                />
                            </Grid>

                            {/* Offer Type */}
                            <Grid item xs={8}>
                                <FormControl sx={{ mb: 0.5 }}>
                                    <FormLabel id="radio-offer-type">Offer Type</FormLabel>
                                    <RadioGroup row>
                                        <FormControlLabel value="offer" control={<Radio />} label="WL Offering" />
                                        <FormControlLabel value="request" control={<Radio />} label="WL Request" />
                                    </RadioGroup>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="Representing Project"
                                    {...getFieldProps('title')}
                                    error={Boolean(touched.title && errors.title)}
                                    helperText={touched.title && errors.title}
                                    sx={{ mb: 1 }}
                                />
                                <Box display="flex" flexDirection="row" sx={{ gap: 1 }}>
                                    <TextField
                                        fullWidth
                                        label="Spots"
                                        {...getFieldProps('title')}
                                        error={Boolean(touched.title && errors.title)}
                                        helperText={touched.title && errors.title}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Run Time"
                                        {...getFieldProps('title')}
                                        error={Boolean(touched.title && errors.title)}
                                        helperText={touched.title && errors.title}
                                    />
                                </Box>
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

export default SubmitRequestForm;
