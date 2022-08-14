import React, { FunctionComponent, ReactElement } from 'react';

// material-ui
import '@mui/styles';
import { Theme } from '@mui/material/styles';
import { SvgIconTypeMap, ChipProps, TableCellProps } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

// project imports
import { TablerIcon } from '@tabler/icons';
import { CalendarStateProps } from './calendar';
import { RarityStateProps } from './rarity';
import { ProposalStateProps } from './proposals';
import { SpaceStateProps } from './spaces';

import { StringPublicKey } from 'utils/ids';
import { Connection } from '@solana/web3.js';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

export type ArrangementOrder = 'asc' | 'desc' | undefined;

export type DateRange = { start: number | Date; end: number | Date };

export type GetComparator = (o: ArrangementOrder, o1: string) => (a: KeyedObject, b: KeyedObject) => number;

export type Direction = 'up' | 'down' | 'right' | 'left';

export interface TabsProps {
    children?: React.ReactElement | React.ReactNode | string;
    value: string | number;
    index?: number;
}

export interface GenericCardProps {
    title?: string;
    primary?: string | number | ReactElement;
    secondary?: string | number | ReactElement;
    content?: string | number | ReactElement;
    image?: string;
    dateTime?: string;
    iconPrimary?: OverrideIcon;
    color?: string;
    size?: string;
}

export type OverrideIcon =
    | (OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
          muiName: string;
      })
    | React.ComponentClass<any>
    | FunctionComponent<any>
    | TablerIcon;

export interface EnhancedTableHeadProps extends TableCellProps {
    onSelectAllClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
    order: ArrangementOrder;
    orderBy?: string;
    numSelected: number;
    rowCount: number;
    onRequestSort: (e: React.SyntheticEvent, p: string) => void;
}

export interface EnhancedTableToolbarProps {
    numSelected: number;
}

export type HeadCell = {
    id: string;
    numeric: boolean;
    label: string;
    disablePadding?: string | boolean | undefined;
    align?: 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined;
};

export type LinkTarget = '_blank' | '_self' | '_parent' | '_top';

export type NavItemTypeObject = { children?: NavItemType[]; items?: NavItemType[]; type?: string };

export type NavItemType = {
    id?: string;
    icon?: GenericCardProps['iconPrimary'];
    target?: boolean;
    external?: string;
    url?: string | undefined;
    type?: string;
    title?: React.ReactNode | string;
    color?: 'primary' | 'secondary' | 'default' | undefined;
    caption?: React.ReactNode | string;
    breadcrumbs?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    soon?: boolean;
    hot?: boolean;
    new?: boolean;
    chip?: ChipProps;
};

export interface ColorPaletteProps {
    color: string;
    label: string;
    value: string;
}

export interface DefaultRootStateProps {
    calendar: CalendarStateProps;
    rarity: RarityStateProps;
    proposals: ProposalStateProps;
    spaces: SpaceStateProps;
}

export interface ColorProps {
    readonly [key: string]: string;
}

export type GuardProps = {
    children: ReactElement | null;
};

export interface StringColorProps {
    id?: string;
    label?: string;
    color?: string;
    primary?: string;
    secondary?: string;
}

export interface FormInputProps {
    bug: KeyedObject;
    fullWidth?: boolean;
    size?: 'small' | 'medium' | undefined;
    label: string;
    name: string;
    required?: boolean;
    InputProps?: {
        label: string;
        startAdornment?: React.ReactNode;
    };
}

export type NftTokenAccount = {
    id?: string;
    data: any;
    isMutable: 0 | 1;
    key: 0 | 1 | 2 | 3 | 4;
    mint: string;
    primarySaleHappened: 0 | 1;
    updateAuthority: string;
};

export type WalletResult = {
    nfts: NftTokenAccount[];
    error: unknown | undefined;
    isLoading: boolean;
};

export type WalletNftProps = {
    publicAddress: StringPublicKey;
    connection?: Connection;
    sanitize?: boolean;
    stringifyPubKeys?: boolean;
    sort?: boolean;
    limit?: number;
};

/** ---- Common Functions types ---- */

export type StringBoolFunc = (s: string) => boolean;
export type StringNumFunc = (s: string) => number;
export type NumbColorFunc = (n: number) => StringColorProps | undefined;
export type ChangeEventFunc = (e: React.ChangeEvent<HTMLInputElement>) => void;

// amit

export type KeyedObject = {
    [key: string]: string | number | KeyedObject | any;
};
