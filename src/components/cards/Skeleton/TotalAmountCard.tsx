// material-ui
import { Card, List, ListItem, ListItemAvatar, ListItemText, Skeleton } from '@mui/material';

const TotalAmountCard = () => (
    <Card sx={{ p: 2 }}>
        <List sx={{ py: 0 }}>
            <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                <ListItemAvatar>
                    <Skeleton variant="rectangular" animation="wave" width={44} height={44} />
                </ListItemAvatar>
                <ListItemText
                    sx={{ py: 0 }}
                    primary={<Skeleton variant="rectangular" animation="wave" height={20} />}
                    secondary={<Skeleton variant="text" animation="wave" />}
                />
            </ListItem>
        </List>
    </Card>
);

export default TotalAmountCard;
