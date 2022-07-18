/* eslint-disable */
import { useState } from 'react';
import { useTheme } from '@mui/styles';
import { CardMedia, Grid, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Stack } from '@mui/material';
import { programs } from '@metaplex/js'
import { useWallet } from '@solana/wallet-adapter-react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// project imports
import { SwitcherCardProps } from 'types/switcher';
import MainCard from 'components/MainCard';
import { updateMetadata } from 'actions/upgrader';
import { mintKeys, originalBase, newBase, originalPngBase, newPngBase } from './art-upgrade';
const { metadata: { Metadata } } = programs

export default function SwitchModal({ mint, role, image, name, item, startLoading, stopLoading, updatePage }: SwitcherCardProps) {
	const theme = useTheme();
	
	const [open, setOpen] = useState(false);
	const id = mintKeys.indexOf(mint) + 1
	const ideath = name.replace(/[^0-9]/g,'')
	const data = [
		{ uri: `${originalBase}/${ideath}.json`, image: `${originalPngBase}/${ideath}.png` },
		{ uri: `${newBase}/${ideath}.json`, image: `${newPngBase}/${ideath}.png` }
	]
	const wallet = useWallet()
	const [selectedUri, setSelectedUri] = useState<string>('');

	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	const onUpdate = async () => {
		if (wallet.publicKey === null) return;
		try {    
			await updateMetadata(
				wallet,
				mint,
				item,
				selectedUri,
				() => startLoading(),
				() => stopLoading(),
				() => updatePage()
			)
		} catch (error) {
			console.log(error);
		}
	};

  	return (
		<>
			<Button variant="outlined" color="success" onClick={handleClickOpen}>
				Update
			</Button>
			<Dialog
				maxWidth="sm"
				fullWidth
				onClose={handleClose}
				open={open}
				sx={{ '& .MuiDialog-paper': { p: 0 } }}
			>
				<DialogTitle>Choose Astronaut Look</DialogTitle>
				<Divider />
				<DialogContent sx={{ p: 3 }}>
					<Grid container justifyContent="center" spacing={2}>
						{data !== undefined && data.map((it: any, index: number) => {
							return (
								<Grid item key={index}>
									<MainCard
										content={false}
										boxShadow
										sx={{
											position: 'relative',
											border: selectedUri === it.uri ? '1px solid' : 'none',
											borderWidth: 4,
											borderColor: theme.palette.secondary.main,
										}}
										onClick={() => setSelectedUri(it.uri)}
										
									>
										{selectedUri === it.uri && <CheckCircleIcon style={{ position: "absolute", top: "6px", right: "8px", fontSize: "46px", color: "#d329ff" }}/> }
										<CardMedia sx={{ width: 250, height: 220 }} image={it.image} />
									</MainCard>
								</Grid>
							)
						})}
					</Grid>
				</DialogContent>
				<Divider />
				<DialogActions sx={{ p: 3 }}>
					<Stack direction="row" justifyContent="space-between" sx={{ gap: 2 }}>
						<Button type="submit" variant="outlined" color="error" fullWidth onClick={handleClose}>
							Cancel
						</Button>
						{selectedUri !== '' ? (
							<Button type="submit" variant="contained" color="secondary" fullWidth onClick={() => {
								onUpdate()
								handleClose()
							}}>
								Update
							</Button>
						) : (
							<Button type="submit" variant="contained" color="secondary" fullWidth disabled>
								Update
							</Button>
						)}
					</Stack>
				</DialogActions>
			</Dialog>
		</>
  	);
}
