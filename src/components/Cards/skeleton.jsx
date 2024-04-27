import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'row',
	background: '#1f1f1f',
	[theme.breakpoints.down('sm')]: {
		flexDirection: 'column',
	},
}));

const StyledBox = styled(CardMedia)(({ theme }) => ({
	width: 300,
	height: 300,
	display: 'flex',
	flexDirection: 'column',
	[theme.breakpoints.down('sm')]: {
		width: '100%',
	},
}));

const NewsCardSkeleton = () => {
	return (
		<StyledCard elevation={0}>
			<StyledBox>
				<Skeleton
					variant='rectangular'
					width={300}
					height={160}
				/>
				<Skeleton
					variant='text'
					width={300}
					height={89}
					sx={{ marginTop: '10px' }}
				/>
			</StyledBox>
			<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
				<Grid
					container
					direction='row'
					spacing={1}
					sx={{ padding: 2 }}>
					<Grid
						item
						xs={12}>
						<Skeleton
							variant='text'
							height={58}
						/>
					</Grid>
					<Grid
						item
						xs={12}>
						<Skeleton
							variant='text'
							height={20}
							width={100}
						/>
					</Grid>
					<Grid
						item
						xs={12}>
						<Skeleton
							variant='text'
							height={20}
							width={100}
						/>
					</Grid>
					<Grid
						item
						xs={12}>
						<Skeleton
							variant='rectangular'
							width={100}
							height={36}
						/>
					</Grid>
				</Grid>
			</Box>
		</StyledCard>
	);
};

export default NewsCardSkeleton;
