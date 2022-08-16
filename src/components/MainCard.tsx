import { forwardRef, Ref } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Divider, Typography, CardProps, CardHeaderProps, CardContentProps } from '@mui/material';

// project-imports
import { KeyedObject } from 'types';

// header style
const headerSX = {
    p: 2.5,
    '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
};

// main card
export interface MainCardProps extends KeyedObject {
    border?: boolean;
    boxShadow?: boolean;
    children: React.ReactNode | string;
    subheader?: React.ReactNode | string;
    content?: boolean;
    contentClass?: string;
    contentSX?: CardContentProps['sx'];
    darkTitle?: boolean;
    divider?: boolean;
    elevation?: number;
    primary?: React.ReactNode | string;
    secondary?: React.ReactNode | string;
    shadow?: string;
    sx?: CardProps['sx'];
    title?: React.ReactNode | string;
    onClick?: () => void;
}

const MainCard = forwardRef(
    (
        {
            border = true,
            boxShadow,
            children,
            subheader,
            content = true,
            contentSX = {},
            darkTitle,
            divider = true,
            elevation,
            primary,
            secondary,
            shadow,
            sx = {},
            title,
            titleSX = {},
            ...others
        }: MainCardProps,
        ref: Ref<HTMLDivElement>
    ) => {
        const theme = useTheme();
        boxShadow = theme.palette.mode === 'dark' ? boxShadow || true : boxShadow;

        return (
            <Card
                elevation={elevation || 0}
                ref={ref}
                {...others}
                sx={{
                    position: 'relative',
                    border: border ? '1px solid rgb(45, 55, 72)' : 'none',
                    borderRadius: 1,
                    borderColor: theme.palette.mode === 'dark' ? 'none' : theme.palette.grey.A700,
                    boxShadow:
                        boxShadow && (!border || theme.palette.mode === 'dark') ? shadow || theme.customShadows.z1 : theme.customShadows.z1,
                    '& pre': {
                        m: 0,
                        p: '12px !important',
                        fontFamily: theme.typography.fontFamily,
                        fontSize: '0.75rem'
                    },
                    ...sx
                }}
            >
                {/* card header & action */}
                {!darkTitle && title && (
                    <CardHeader
                        sx={{
                            p: 1.5,
                            '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' },
                            ...titleSX
                        }}
                        titleTypographyProps={{ variant: 'subtitle1' }}
                        title={title}
                        avatar={primary}
                        action={secondary}
                        subheader={subheader}
                    />
                )}

                {darkTitle && title && (
                    <CardHeader sx={headerSX} title={<Typography variant="h3">{title}</Typography>} avatar={primary} action={secondary} />
                )}

                {/* content & header divider */}
                {title && divider && <Divider />}

                {/* card content */}
                {content && <CardContent sx={contentSX}>{children}</CardContent>}
                {!content && children}
            </Card>
        );
    }
);

export default MainCard;
