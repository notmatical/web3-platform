import { ForwardRefExoticComponent, RefAttributes, forwardRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery } from '@mui/material';

// project imports
import useConfig from 'hooks/useConfig';
import { useDispatch, useSelector } from 'store';
import { activeItem, openDrawer } from 'store/slices/menu';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { FireOutlined } from '@ant-design/icons';

// types
import { LinkTarget, NavItemType } from 'types';

interface NavItemProps {
    item: NavItemType;
    level: number;
}

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavItem = ({ item, level }: NavItemProps) => {
    const theme = useTheme();
    const matchesSM = useMediaQuery(theme.breakpoints.down('lg'));

    const { borderRadius } = useConfig();
    const dispatch = useDispatch();
    const { openItem } = useSelector((state) => state.menu);

    const Icon = item?.icon!;
    const itemIcon = item?.icon ? (
        <Icon stroke={1.5} size="1.3rem" />
    ) : (
        <FiberManualRecordIcon
            sx={{
                width: openItem.findIndex((id) => id === item?.id) > -1 ? 8 : 6,
                height: openItem.findIndex((id) => id === item?.id) > -1 ? 8 : 6
            }}
            fontSize={level > 0 ? 'inherit' : 'medium'}
        />
    );

    let itemTarget: LinkTarget = '_self';
    if (item.target) {
        itemTarget = '_blank';
    }

    let listItemProps: {
        component: ForwardRefExoticComponent<RefAttributes<HTMLAnchorElement>> | string;
        href?: string;
        target?: LinkTarget;
    } = { component: forwardRef((props, ref) => <Link ref={ref} {...props} to={item.url!} target={itemTarget} />) };
    if (item?.external) {
        listItemProps = { component: 'a', href: item.url, target: itemTarget };
    }

    const itemHandler = (id: string) => {
        dispatch(activeItem([id]));
        matchesSM && dispatch(openDrawer(false));
    };

    // active menu item on page load
    useEffect(() => {
        const currentIndex = document.location.pathname
            .toString()
            .split('/')
            .findIndex((id) => id === item.id);
        if (currentIndex > -1) {
            dispatch(activeItem([item.id!]));
        }
        // eslint-disable-next-line
    }, []);

    return (
        <ListItemButton
            {...listItemProps}
            disabled={item.disabled}
            sx={{
                cursor: item.hidden ? 'not-allowed' : 'pointer',
                borderRadius: `${borderRadius}px`,
                mb: 0.5,
                alignItems: 'flex-start',
                backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
                py: level > 1 ? 1 : 1.25,
                pl: `${level * 24}px`
            }}
            selected={openItem?.findIndex((id) => id === item.id) > -1}
            onClick={() => itemHandler(item.id!)}
        >
            <ListItemIcon sx={{ my: 'auto', minWidth: !item?.icon ? 18 : 36 }}>{itemIcon}</ListItemIcon>
            <ListItemText
                primary={
                    item.hidden ? (
                        <Typography
                            variant={openItem?.findIndex((id) => id === item.id) > -1 ? 'h5' : 'body1'}
                            data-text="???????"
                            className="glitch layers"
                            color="inherit"
                            sx={{
                                animation: 'paths 5s step-end infinite',
                                letterSpacing: '6px',
                                filter: 'drop-shadow(0 1px 3px)'
                            }}
                        >
                            ???????
                        </Typography>
                    ) : (
                        <Typography variant={openItem?.findIndex((id) => id === item.id) > -1 ? 'h5' : 'body1'} color="inherit">
                            {item.title}
                        </Typography>
                    )
                }
                secondary={
                    item.caption && (
                        <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                            {item.caption}
                        </Typography>
                    )
                }
            />
            {item.hidden && (
                <Chip
                    sx={{
                        fontWeight: 500,
                        borderRadius: '4px !important',
                        background: '#f38aff'
                    }}
                    color="secondary"
                    variant="filled"
                    size="small"
                    label="SOON"
                />
            )}
            {item.soon && (
                <Chip
                    sx={{
                        fontWeight: 500,
                        borderRadius: '4px !important',
                        background: '#f38aff'
                    }}
                    color="secondary"
                    variant="filled"
                    size="small"
                    label="SOON"
                />
            )}
            {item.hot && (
                <Chip
                    sx={{
                        fontWeight: 500,
                        borderRadius: '4px !important',
                        background: '#d48342'
                    }}
                    color="secondary"
                    variant="filled"
                    size="small"
                    label="HOT"
                />
            )}
            {item.new && (
                <Chip
                    sx={{
                        fontWeight: 500,
                        borderRadius: '4px !important',
                        background: '#4291d4'
                    }}
                    color="secondary"
                    variant="filled"
                    size="small"
                    label="NEW"
                />
            )}
            {item.chip && (
                <Chip
                    sx={{ fontWeight: 500, borderRadius: '4px !important' }}
                    color={item.chip.color}
                    variant={item.chip.variant}
                    size={item.chip.size}
                    label={item.chip.label}
                    avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
                />
            )}
        </ListItemButton>
    );
};

export default NavItem;
