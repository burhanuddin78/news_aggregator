import React from 'react';
import { Container, Divider, Grid } from '@mui/material';
import NewsCard from '../Cards';
import SkeletonCard from '../Cards/skeleton';

const NewsPage = ({ newsData, loading }) => {
	return (
		<Grid
			item
			container
			style={{ backgroundColor: '#292a2d', padding: '32px 0', minHeight: '100vh' }}>
			<Container
				maxWidth='md'
				style={{
					backgroundColor: '#1f1f1f',
					borderRadius: '16px',
					padding: '16px',
				}}>
				<Grid
					container
					spacing={2}>
					{loading ? (
						Array.from({ length: 4 }).map((_, index) => (
							<Grid
								item
								xs={12}
								key={index}>
								<SkeletonCard />
							</Grid>
						))
					) : newsData.length > 0 ? (
						// If newsData has items, map over them and display NewsCard for each
						newsData.map((newsItem, index) => (
							<React.Fragment key={index}>
								<Grid
									item
									xs={12}>
									<NewsCard
										{...newsItem}
										index={index}
									/>
									<Divider
										orientation='horizontal'
										variant='middle'
										flexItem
										sx={{ bgcolor: '#5f6368' }}
									/>
								</Grid>
							</React.Fragment>
						))
					) : (
						// If newsData is empty, display "No data found" message
						<Grid
							item
							xs={12}
							sx={{ color: 'white', textAlign: 'center' }}>
							<p>No data found</p>
						</Grid>
					)}
				</Grid>
			</Container>
		</Grid>
	);
};

export default NewsPage;
