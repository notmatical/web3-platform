import { useMemo } from 'react';

// material-ui
import { Chip, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

// third-party
import { useTable } from 'react-table';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import LinearWithLabel from 'components/@extended/Progress/LinearWithLabel';

// ==============================|| REACT TABLE ||============================== //
interface BasicTableProps {
    data: any;
    striped?: boolean;
    title: string;
}

interface ReactTableProps {
    columns: any;
    data: any;
    striped?: boolean;
}

function ReactTable({ columns, data, striped }: ReactTableProps) {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data
    });

    return (
        <Table {...getTableProps()}>
            <TableHead>
                {headerGroups.map((headerGroup: any) => (
                    <TableRow {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column: any) => (
                            <TableCell {...column.getHeaderProps([{ className: column.className }])}>{column.render('Header')}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableHead>
            <TableBody {...getTableBodyProps()} {...(striped && { className: 'striped' })}>
                {rows.map((row: any, i: number) => {
                    prepareRow(row);
                    return (
                        <TableRow {...row.getRowProps()} key={i}>
                            {row.cells.map((cell: any) => (
                                <TableCell {...cell.getCellProps([{ className: cell.column.className }])}>{cell.render('Cell')}</TableCell>
                            ))}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

// ==============================|| REACT TABLE - BASIC ||============================== //

const BasicTable = ({ data, striped, title }: BasicTableProps) => {
    const columns = useMemo(
        () => [
            {
                Header: '#',
                accessor: 'id'
            },
            {
                Header: 'Project',
                accessor: 'lastName'
            },
            {
                Header: 'Price',
                accessor: 'age',
                className: 'cell-right'
            },
            {
                Header: '24h %',
                accessor: 'visits',
                className: 'cell-right'
            },
            {
                Header: '7d %',
                accessor: 'contact',
                className: 'cell-right'
            },
            {
                Header: '30d %',
                accessor: 'role',
                className: 'cell-right'
            },
            {
                Header: 'Listed',
                accessor: 'country',
                className: 'cell-right'
            },
            {
                Header: 'Volume',
                accessor: 'fatherName',
                className: 'cell-right'
            },
            {
                Header: 'Vol 24h',
                accessor: 'orderStatus',
                className: 'cell-right'
            },
            {
                Header: 'Last 7 Days',
                accessor: 'progress',
                // eslint-disable-next-line
                Cell: ({ value }: { value: any }) => <LinearWithLabel value={value} sx={{ minWidth: 75 }} />
            }
        ],
        []
    );

    return (
        <MainCard content={false} border={false}>
            <ScrollX>
                <ReactTable columns={columns} data={data} striped={striped} />
            </ScrollX>
        </MainCard>
    );
};

export default BasicTable;
