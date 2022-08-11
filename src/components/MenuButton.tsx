import { Button, Menu, MenuItem } from '@mui/material';
import { map } from 'lodash';
import { useState } from 'react';

// eslint-disable-next-line import/prefer-default-export
export function MenuButton(props: any) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isView, setIsView] = useState(false);
    const {
        variant = 'text',
        sx = {
            textTransform: 'none',
            color: 'text.primary',
            p: 0,
            fontWeight: 400,
            fontSize: '0.875rem',
            lineHeight: 1.5,
            letterSpacing: '0.00938em',
            alignItems: 'flex-start'
        },
        items,
        label,
        ...otherProps
    } = props;
    return (
        <>
            <Button
                variant={variant}
                sx={sx}
                {...otherProps}
                onClick={(event) => {
                    setAnchorEl(event?.currentTarget);
                    setIsView(!isView);
                }}
            >
                {label}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={isView}
                onClose={() => {
                    setAnchorEl(null);
                    setIsView(false);
                }}
            >
                {map(items, ({ label: itemLabel, ...otherItemProps }: any, key: number) => (
                    <MenuItem key={key} {...otherItemProps}>
                        {itemLabel}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}
