import { Container, Grid, Pagination, Typography } from '@mui/material';
import { filter, map } from 'lodash';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

export default function PagedList(props: {
    component: any;
    pageSize: number;
    masterList: Array<any>;
    pageList: Array<any>;
    getPage: (page: number, chunked?: Array<Array<any>>) => any;
}) {
    const { component, masterList, pageList, getPage, pageSize } = props;
    const [page, setPage] = useState(1);
    const CustomComponent = component;

    const handlePageChange = (event: any, value: number) => {
        setPage(value);
        getPage(value);
    };
    return (
        <Container maxWidth="xl">
            <Grid container spacing={3}>
                {pageList &&
                    pageList.length !== 0 &&
                    map(
                        filter(pageList, (itm: any, idx: number) => idx >= pageSize * (page - 1) && idx < pageSize * page),
                        (item: any, key: number) => <CustomComponent {...item} key={key} />
                    )}
                <Grid item xl={12}>
                    {masterList && masterList.length === 0 && (
                        <Typography component="p">
                            <FormattedMessage id="wallet-empty" />
                        </Typography>
                    )}
                </Grid>
            </Grid>
            <Pagination
                count={masterList.length}
                color="primary"
                page={page}
                onChange={handlePageChange}
                sx={{
                    justifyContent: 'center',
                    display: 'flex'
                }}
            />
        </Container>
    );
}
