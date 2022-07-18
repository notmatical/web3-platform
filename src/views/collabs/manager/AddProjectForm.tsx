// material-ui
import {
    Avatar,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Autocomplete,
    Grid,
    InputAdornment,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';

// project imports
import { gridSpacing } from 'store/constant';

// assets
import DateRangeIcon from '@mui/icons-material/DateRange';

// constant
const getInitialValues = () => {
    const newProject = {
        name: '',
        description: '',
        template: '',
        spots: '',
        mintPrice: null,
        mintDate: null,
        mintSupply: null,
        discord: null,
        twitter: null
    };

    return newProject;
};

// ==============================|| CREATE PROJECT ||============================== //

interface AddProjectFormProps {
    handleCreate: (d: FormikValues) => void;
    onCancel: () => void;
}

const AddProjectForm = ({ handleCreate, onCancel }: AddProjectFormProps) => {
    const ProjectSchema = Yup.object().shape({
        name: Yup.string().max(255).required('Please select a project.'),
        description: Yup.string().max(1000).required('You must provide a Description.'),
        template: Yup.string().max(1000).required('You must provide a Template.'),
        spots: Yup.string().max(64).required('You must provide an amount of WL Spots available.'),
        mintPrice: Yup.string().max(64).nullable(),
        mintDate: Yup.date().nullable(),
        mintSupply: Yup.string().max(64).nullable(),
        discord: Yup.string().max(255).nullable(),
        twitter: Yup.string().max(255).nullable()
    });

    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: ProjectSchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                const data = {
                    name: values.name,
                    description: values.description,
                    template: values.template,
                    spots: values.spots,
                    mintPrice: values.mintPrice,
                    mintDate: values.mintDate,
                    mintSupply: values.mintSupply,
                    discord: values.discord,
                    twitter: values.twitter
                };

                console.log(data);

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
                    <DialogTitle>Link your Project</DialogTitle>
                    <Divider />
                    <DialogContent sx={{ p: 3 }}>
                        <Grid container spacing={gridSpacing}>
                            {/* Project Select */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    {...getFieldProps('name')}
                                    error={Boolean(touched.name && errors.name)}
                                    helperText={touched.name && errors.name}
                                />
                            </Grid>
                            {/* Description */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Description"
                                    {...getFieldProps('description')}
                                    error={Boolean(touched.description && errors.description)}
                                    helperText={touched.description && errors.description}
                                />
                                <Typography variant="caption" display="block" sx={{ ml: 2 }}>
                                    Write a few sentences about your project.
                                </Typography>
                            </Grid>
                            {/* Template */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Collaboration Template"
                                    {...getFieldProps('template')}
                                    error={Boolean(touched.template && errors.template)}
                                    helperText={touched.template && errors.template}
                                />
                                <Typography variant="caption" display="block" sx={{ ml: 2 }}>
                                    Share your collaboration template for the project.
                                </Typography>
                            </Grid>
                            {/* Mint Price */}
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    label="Mint Price"
                                    {...getFieldProps('mintPrice')}
                                    error={Boolean(touched.mintPrice && errors.mintPrice)}
                                    helperText={touched.mintPrice && errors.mintPrice}
                                />
                            </Grid>
                            {/* Mint Date */}
                            <Grid item xs={4}>
                                <MobileDateTimePicker
                                    label="Mint Date"
                                    value={values.mintDate}
                                    inputFormat="MM/dd/yyyy hh:mm a"
                                    onChange={(date) => setFieldValue('mintDate', date)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <DateRangeIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            {/* Mint Supply */}
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    label="Mint Supply"
                                    {...getFieldProps('mintSupply')}
                                    error={Boolean(touched.mintSupply && errors.mintSupply)}
                                    helperText={touched.mintSupply && errors.mintSupply}
                                />
                            </Grid>
                            {/* Spots Available */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="WL Spots"
                                    {...getFieldProps('spots')}
                                    error={Boolean(touched.spots && errors.spots)}
                                    helperText={touched.spots && errors.spots}
                                />
                                <Typography variant="caption" display="block" sx={{ ml: 2 }}>
                                    Share your total amount of WL spots available.
                                </Typography>
                            </Grid>
                            {/* Discord */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Discord Invite"
                                    {...getFieldProps('discord')}
                                    error={Boolean(touched.discord && errors.discord)}
                                    helperText={touched.discord && errors.discord}
                                />
                            </Grid>
                            {/* Twitter */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Twitter"
                                    {...getFieldProps('twitter')}
                                    error={Boolean(touched.twitter && errors.twitter)}
                                    helperText={touched.twitter && errors.twitter}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions sx={{ p: 3 }}>
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Button type="submit" variant="contained" color="secondary" fullWidth disabled={isSubmitting}>
                                Next Step
                            </Button>
                        </Grid>
                    </DialogActions>
                </Form>
            </LocalizationProvider>
        </FormikProvider>
    );
};

export default AddProjectForm;
