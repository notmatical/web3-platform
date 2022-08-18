import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Typography } from '@mui/material';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';

// project imports
import { BASE_PATH } from 'config';
import MainCard from 'components/MainCard';

// assets
import { ApartmentOutlined, HomeFilled, HomeOutlined } from '@ant-design/icons';

import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import HomeIcon from '@mui/icons-material/Home';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import { NavItemType, NavItemTypeObject, OverrideIcon } from 'types';

const linkSX = {
    display: 'flex',
    color: 'grey.900',
    textDecoration: 'none',
    alignContent: 'center',
    alignItems: 'center'
};

interface BreadCrumbSxProps extends React.CSSProperties {
    mb?: string;
    bgcolor?: string;
}

interface BreadCrumbsProps {
    card?: boolean;
    divider?: boolean;
    icon?: boolean;
    icons?: boolean;
    maxItems?: number;
    navigation?: NavItemTypeObject;
    rightAlign?: boolean;
    separator?: OverrideIcon;
    title?: boolean;
    titleBottom?: boolean;
    sx?: BreadCrumbSxProps;
}

// ==============================|| BREADCRUMBS ||============================== //

const Breadcrumbs = ({
    card,
    divider = true,
    icon,
    icons,
    maxItems,
    navigation,
    rightAlign,
    separator,
    title,
    titleBottom,
    sx,
    ...others
}: BreadCrumbsProps) => {
    const theme = useTheme();
    const location = useLocation();
    const [main, setMain] = useState<NavItemType | undefined>();
    const [item, setItem] = useState<NavItemType>();

    const iconSX = {
        marginRight: theme.spacing(0.75),
        marginTop: `-${theme.spacing(0.25)}`,
        width: '1rem',
        height: '1rem',
        color: theme.palette.secondary.main
    };

    // set active item state
    const getCollapse = (menu: NavItemTypeObject) => {
        if (menu.children) {
            menu.children.filter((collapse: NavItemType) => {
                if (collapse.type && collapse.type === 'collapse') {
                    getCollapse(collapse as { children: NavItemType[]; type?: string });
                } else if (collapse.type && collapse.type === 'item') {
                    if (document.location.pathname === BASE_PATH + collapse.url) {
                        setMain(menu);
                        setItem(collapse);
                    }
                }
                return false;
            });
        }
    };

    useEffect(() => {
        navigation?.items?.map((menu: NavItemType | NavItemTypeObject, index: number) => {
            if (menu.type && menu.type === 'group') {
                getCollapse(menu as { children: NavItemType[]; type?: string });
            }
            return false;
        });
    });

    // item separator
    const SeparatorIcon = separator!;
    const separatorIcon = separator ? <SeparatorIcon style={{ fontSize: '0.75rem', marginTop: 2 }} /> : '/';

    let mainContent;
    let itemContent;
    let breadcrumbContent: React.ReactElement = <Typography />;
    let itemTitle: NavItemType['title'] = '';
    let CollapseIcon;
    let ItemIcon;

    // collapse item
    if (main && main.type === 'collapse') {
        CollapseIcon = main.icon ? main.icon : AccountTreeTwoToneIcon;
        mainContent = (
            <Typography
                component={Link}
                to={document.location.pathname}
                variant="h6"
                sx={{ textDecortation: 'none' }}
                color="textSecondary"
            >
                {icons && <CollapseIcon style={iconSX} />}
                {main.title}
            </Typography>
        );
    }

    // items
    if (item && item.type === 'item') {
        itemTitle = item.title;

        ItemIcon = item.icon ? item.icon : ApartmentOutlined;
        itemContent = (
            <Typography variant="subtitle1" color="textPrimary">
                {icons && <ItemIcon style={iconSX} />}
                {itemTitle}
            </Typography>
        );

        // main
        if (item.breadcrumbs !== false) {
            breadcrumbContent = (
                <MainCard
                    border={card}
                    sx={card === false ? { mb: 3, bgcolor: 'transparent', ...sx } : { mb: 3, ...sx }}
                    {...others}
                    content={card}
                    shadow="none"
                >
                    <Grid
                        container
                        direction={rightAlign ? 'row' : 'column'}
                        justifyContent={rightAlign ? 'space-between' : 'flex-start'}
                        alignItems={rightAlign ? 'center' : 'flex-start'}
                        spacing={1}
                    >
                        {title && !titleBottom && (
                            <Grid item>
                                <Typography variant="h2">{item.title}</Typography>
                            </Grid>
                        )}
                        <Grid item>
                            <MuiBreadcrumbs aria-label="breadcrumb" maxItems={maxItems || 8} separator={separatorIcon}>
                                <Typography component={Link} to="/home" color="primary" variant="subtitle1" sx={{ textDecoration: 'none' }}>
                                    {icons && <HomeOutlined style={iconSX} />}
                                    {icon && !icons && <HomeFilled style={{ ...iconSX, marginRight: 0 }} />}
                                    {(!icon || icons) && 'Home'}
                                </Typography>
                                {mainContent}
                                {itemContent}
                            </MuiBreadcrumbs>
                        </Grid>
                        {title && titleBottom && (
                            <Grid item sx={{ mt: card === false ? 0.25 : 1 }}>
                                <Typography variant="h2">{item.title}</Typography>
                            </Grid>
                        )}
                    </Grid>
                    {card === false && divider !== false && <Divider sx={{ mt: 2 }} />}
                </MainCard>
            );
        }
    }

    return breadcrumbContent;
};

export default Breadcrumbs;
