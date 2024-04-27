import React from 'react';
import { Button, Grid, Typography, CardMedia, Box, Card } from '@mui/material';
import { styled } from '@mui/system';

const StyledTypography = styled(Typography)({
	color: '#e3e3e3',
});

const StyledHeadline = styled(Typography)({
	color: '#e3e3e3',
	fontSize: '1.25rem',
	lineHeight: '1.3',
	fontWeight: 400,
	fontFamily: 'Google Sans, sans-serif',
	overflow: 'hidden',
	textAlign: 'left',
	padding: '20px',
	paddingLeft: '0px',
	height: '89px',
});
const StyledDescription = styled(Typography)({
	color: '#e3e3e3',
	overflow: 'hidden',
	textAlign: 'left',
	paddingTop: '0px !important',
	height: '58px',
});
const StyledButton = styled(Button)({
	background: '#303030',
	color: '#c4c7c5',
	fontSize: '.75rem',
	lineHeight: '1.5',
	fontWeight: 500,
});
const anchorStyle = {
	textDecoration: 'underline white',
	color: 'inherit',
	cursor: 'pointer',
	transition: 'color 0.3s',
};
const StyledGrid = styled(Grid)(({ theme }) => ({
	paddingTop: '0px !important',
	[theme.breakpoints.down('sm')]: {
		paddingLeft: '0px !important',
		marginTop: '0px !important',
	},
}));
const StyledCard = styled(Card)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'row',
	background: '#1f1f1f',
	[theme.breakpoints.down('sm')]: {
		flexDirection: 'column',
	},
}));
const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
	width: '280px',
	height: '168px',
	borderRadius: '10px',
	[theme.breakpoints.down('sm')]: {
		width: '100%',
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

//***************************** helper function ***********************************/
const calculateTimeDifference = (publishTime) => {
	// Convert publish time string to a JavaScript Date object
	const publishDate = new Date(publishTime);

	// Get the current time
	const currentDate = new Date();

	// Calculate the difference in milliseconds
	const difference = currentDate - publishDate;

	// Convert difference to minutes and hours
	const minutes = Math.floor((difference / (1000 * 60)) % 60);
	const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);

	let timeString = '';

	if (hours > 0) {
		timeString += hours + (hours === 1 ? ' hour ' : ' hours ');
	}
	if (minutes > 0) {
		timeString += minutes + (minutes === 1 ? ' minute' : ' minutes');
	}

	return timeString.trim();
};

const handleButtonClick = (source) => {
	window.open(source, '_blank');
};
//*****************************  ***********************************/
const NewsCard = ({ coverImage, url, title, description, source, publishedAt, index }) => {
	// jsx rendering
	return (
		<StyledCard
			key={index}
			elevation={0}>
			<StyledBox>
				<StyledCardMedia
					component='img'
					sx={{ width: 300, height: 160 }}
					image={coverImage || '/default-image.png'}
					alt='Image title'
				/>
				<a
					href={url}
					target='_blank'
					rel='noopener noreferrer'
					style={anchorStyle}>
					<StyledHeadline>{title}</StyledHeadline>
				</a>
			</StyledBox>
			<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
				<StyledGrid
					container
					direction='row'
					spacing={1}
					sx={{ padding: 2 }}>
					<Grid
						item
						xs={12}>
						<StyledDescription variant='body2'>{description}</StyledDescription>
					</Grid>
					<Grid
						item
						xs={12}>
						<StyledTypography variant='body2'>{source}</StyledTypography>
					</Grid>
					<Grid
						item
						xs={12}>
						<StyledTypography variant='body2'> {calculateTimeDifference(publishedAt)} ago</StyledTypography>
					</Grid>
					<Grid
						item
						xs={12}>
						<StyledButton
							variant='contained'
							onClick={() => handleButtonClick(url)}>
							Full coverage
						</StyledButton>
					</Grid>
				</StyledGrid>
			</Box>
		</StyledCard>
	);
};

export default NewsCard;
