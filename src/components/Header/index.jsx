import React, { useState, useRef, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import {
	AppBar,
	Box,
	Toolbar,
	Typography,
	InputBase,
	IconButton,
	Divider,
	Tab,
	Tabs,
	TextField,
	MenuItem,
	Button,
	Select,
	Popper,
	Tooltip,
	useMediaQuery,
} from '@mui/material';
import { Search as SearchIcon, ArrowDropDown as ArrowDropDownIcon, Clear as ClearIcon } from '@mui/icons-material';

// Styled components for custom styling
const SearchBox = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	'&:hover': {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	display: 'flex',
	alignItems: 'center',
	margin: 'auto',
	radius: '12px',
	height: '45px',
	width: '60%',
	[theme.breakpoints.down('md')]: {
		width: '80%',
		height: '35px',
	},
}));

const ToolbarCentered = styled(Toolbar)(({ theme }) => ({
	display: 'flex',
	justifyContent: 'center',

	[theme.breakpoints.down('sm')]: {
		flexDirection:"column",
	},
}));
const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 1),
}));

const ClearIconWrapper = styled('div')(({ theme }) => ({
	height: '100%',
	display: 'flex',
	alignItems: 'center',
}));

const DropdownIconWrapper = styled('div')(({ theme }) => ({
	height: '100%',
	display: 'flex',
	alignItems: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-root': {
		width: '100% !important',
	},
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		paddingLeft: `calc(1em + ${theme.spacing(0)})`,
		transition: theme.transitions.create('width'),
		width: '100% !important',
		height: '100%',
	},
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
	'& .MuiTabs-indicator': {
		backgroundColor: '#1a73e8',
		height: '3px', // Adjust height of the indicator
	},
	'& .MuiTab-root': {
		textDecoration: 'none',
		fontSize: '0.875rem',
		color: '#bdc1c6',
		margin: '0px 16px',
		fontFamily: 'Google Sans, sans-serif',
		fontWeight: 600,
		cursor: 'pointer',
		textTransform: 'capitalize',
		height: 'auto', // Set height to auto
		padding: '6px 12px', // Adjust padding as needed

		'&:hover': {
			color: '#8ab4f8',
			backgroundColor: 'transparent', // Remove background color on hover
		},
		'&.Mui-selected': {
			color: '#1a73e8', // Change color of selected tab
		},
	},
}));

const StyledAppBar = styled(AppBar)({
	backgroundColor: '#1f1f1f',
	padding: 0,
	borderBottom: '.8px solid #5f6368',
});

const Row = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	width: '100%',
	marginBottom: '.5em',
}));
const LastRow = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	width: '100%',
	marginTop: '.5em',
}));

const TextFieldWhite = styled(TextField)({
	'& .MuiInputBase-input': {
		color: 'white',
	},
});

const FilterBox = styled(Box)(({ theme }) => ({
	width: '300px', // Increase width as needed
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	padding: theme.spacing(1),
	background: '#35363a',
	borderRadius: '0 0 8px 8px', // Add border radius to bottom
	boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', // Add box shadow
}));

const TypographyWhite = styled(Typography)({
	marginRight: '.6rem',
	minWidth: '100px',
	color: '#bdc1c6',
	fontSize: '.8em',
});

export default function Header({ fetchDataAsync }) {
	// State variables
	const [selectedTab, setSelectedTab] = useState(0);
	const [anchorEl, setAnchorEl] = useState(null);
	const [popperAnchorEl, setPopperAnchorEl] = useState(null);
	const [search, setSearch] = useState('');
	const [keywords, setKeywords] = useState('');
	const [author, setAuthor] = useState('');
	const [dateValue, setDateValue] = useState('');
	const popperRef = useRef(null);

	const mobileScreen = useMediaQuery('(max-width:600px)');


	// ****************** Handlers **************************

	const handleFilterClick = (event) => {
		setAnchorEl(event.currentTarget);
		setPopperAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
		setPopperAnchorEl(null);
	};

	const handleClearClick = () => {
		setSearch('');
		fetchDataAsync(selectedTab, null, null, null, null);
	};

	// Handler for tab selection
	const handleTabSelect = (e, newValue) => {
		setSelectedTab(newValue);
		handleClearFilters();
		fetchDataAsync(newValue, null, null, null, null);
	};

	// Handler for search input change
	const handleSearchChange = (event) => {
		let input = event.target.value;
		setSearch(input);
		// debounceSearch();
	};

	const handleSearchClick = () => {
		fetchDataAsync(selectedTab, search, keywords, dateValue, author);
	};

	const handlekeywordChange = (event) => {
		setKeywords(event.target.value);
	};
	const handleDateChange = (event) => {
		setDateValue(event.target.value);
	};

	const handleClearFilters = () => {
		setSearch('');
		setDateValue('');
		setKeywords('');
		setAuthor('');
	};

	// *******************************************

	useEffect(() => {
		function handleClickOutside(event) {
			// Close the Popper when clicking outside
			if (popperRef.current && !popperRef.current.contains(event.target) && !document?.querySelector('.MuiMenu-list')?.contains(event.target)) {
				handleClose();
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [popperRef]);

	useEffect(() => {
		const timeout = setTimeout(async () => {
			await fetchDataAsync(selectedTab, search, keywords, dateValue,  author);
		}, 500);

		// if this effect run again, because `value` changed, we remove the previous timeout
		return () => clearTimeout(timeout);
	}, [search]);

	// JSX structure
	return (
		<Box sx={{ flexGrow: 1 }}>
			<StyledAppBar position='static'>
				<ToolbarCentered>
					<Typography
						variant='h6'
						component='div'>
						News App
					</Typography>
					<SearchBox aria-describedby={anchorEl ? 'filter-box' : ''}>
						<SearchIconWrapper>
							<SearchIcon />
						</SearchIconWrapper>
						<StyledInputBase
							sx={{ width: '100%' }}
							placeholder='Search for topics...'
							inputProps={{ 'aria-label': 'search' }}
							value={search}
							onChange={handleSearchChange}
						/>
						<ClearIconWrapper>
							<Tooltip title='Clear'>
								<IconButton onClick={handleClearClick}>
									<ClearIcon />
								</IconButton>
							</Tooltip>
						</ClearIconWrapper>
						<DropdownIconWrapper>
							<Tooltip title='Advanced Filter'>
								<IconButton
									aria-controls='filter-box'
									aria-haspopup='true'
									onClick={handleFilterClick}>
									<ArrowDropDownIcon />
								</IconButton>
							</Tooltip>
						</DropdownIconWrapper>
					</SearchBox>
					{/* Filter Popper */}
					<Popper
						id={anchorEl ? 'filter-box' : ''}
						open={Boolean(anchorEl)}
						placement='bottom-end'
						anchorEl={popperAnchorEl}
						ref={popperRef}>
						<FilterBox
							id='filter-box'
							ref={popperRef}>
							<Row>
								<TypographyWhite>Keyword</TypographyWhite>
								<TextFieldWhite
									sx={{ width: '100%' }}
									variant='standard'
									value={keywords}
									placeholder='for eg chips AND sauces'
									onChange={handlekeywordChange}
								/>
							</Row>
							<Row>
								<TypographyWhite>Author</TypographyWhite>
								<TextFieldWhite
									sx={{ width: '100%' }}
									variant='standard'
									value={author}
									placeholder='author name'
									onChange={(e) => setAuthor(e.target.value)}
								/>
							</Row>
							<Row>
								<TypographyWhite>Date</TypographyWhite>
								<Select
									variant='standard'
									value={dateValue}
									sx={{ width: '100%', color: 'white' }}
									onChange={handleDateChange}
									label='Date'>
									<MenuItem value='today'>Today</MenuItem>
									<MenuItem value='yesterday'>Yesterday</MenuItem>
									<MenuItem value='lastMonth'>Past Month</MenuItem>
									<MenuItem value='lastYear'>Past Year</MenuItem>
								</Select>
							</Row>
							<LastRow
								justifyContent='flex-end'
								sx={{ marginTop: '2em' }}>
								<Button
									onClick={handleClose}
									size='small'>
									Close
								</Button>
								<Button
									onClick={handleSearchClick}
									variant='contained'
									size='small'>
									Search
								</Button>
							</LastRow>
						</FilterBox>
					</Popper>
				</ToolbarCentered>
				{/* Tabs */}
				<StyledTabs
					value={selectedTab}
					onChange={handleTabSelect}
					aria-label='Tabs where selection follows focus'
					allowScrollButtonsMobile
					scrollButtons
					disableRipple
					disableFocusRipple
					variant={mobileScreen ? "scrollable" : "standard"}
					centered>
					<Tab
						value={0}
						label='for you'
					/>
					<Divider
						orientation='vertical'
						variant='middle'
						flexItem
						sx={{ bgcolor: '#5f6368' }}
					/>
					<Tab
						value={1}
						label='Sports'
					/>
					<Tab
						value={2}
						label='Entertainment'
					/>
					<Tab
						value={3}
						label='Technology'
					/>
					<Tab
						value={4}
						label='Science'
					/>
					<Tab
						value={5}
						label='Business'
					/>
				</StyledTabs>
			</StyledAppBar>
		</Box>
	);
}
