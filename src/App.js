import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard/index.jsx';

import { fetchNews } from './api';

const App = () => {
	const [data, setData] = useState({});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchDataAsync();
	}, []);

	const fetchDataAsync = async (tab, search, keyword, dateOption, source) => {
		setLoading(true);
		setData([]);
		const fetchedData = await fetchNews(tab, search, keyword, dateOption, source);
		setData(fetchedData);
		setLoading(false);
	};

	return (
		<div>
			<Header fetchDataAsync={fetchDataAsync} />
			<Dashboard
				newsData={data}
				loading={loading}
			/>
		</div>
	);
};

export default App;
