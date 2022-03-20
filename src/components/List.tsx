import React, { useState, useEffect, useReducer } from "react"

export default function List() {
	const [coins, setCoins] = React.useState<any[]>([]);

	useEffect(() => {
        fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=aud&order=market_cap_desc&per_page=100&page=1&sparkline=false")
            .then(res => res.json())
            .then((result) => {
                setCoins(result);
            });
	}, [])

    const orderCoins = (sort = 'market') => {
        // Todo: sort both ways
        let tempCoins = coins;

        if (sort === 'name') {
            tempCoins.sort((a, b) => {
                if(a.name.toLowerCase() > b.name.toLowerCase()) {
                    return 1;
                } else if(a.name.toLowerCase() < b.name.toLowerCase()) {
                    return -1;
                } else {
                    return 0;
                }
            });
        } else if (sort === 'price') {
            tempCoins.sort((a, b) => {
                if(a.current_price > b.current_price) {
                    return 1;
                } else if(a.current_price < b.current_price) {
                    return -1;
                } else {
                    return 0;
                }
            });
        } else if (sort === 'market') {
            tempCoins.sort((a, b) => {
                if(a.market_cap > b.market_cap) {
                    return 1;
                } else if(a.market_cap < b.market_cap) {
                    return -1;
                } else {
                    return 0;
                }
            });
        }
        setCoins([...tempCoins]);
    }

    // Todo: add search

	return (
		<>
            <h1>Top 100 Coins</h1>

			<table>
                <thead>
                    <tr>
                        <th>Position</th>
                        <th onClick={e => orderCoins('name')}>Coin</th>
                        <th onClick={e => orderCoins('price')}>Price</th>
                        <th onClick={e => orderCoins('market')}>Market cap</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        !coins ? 'Loading...' : coins.map((coin, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{coin.name}</td>
                                    <td>{coin.current_price}</td>
                                    <td>{coin.market_cap}</td>
                                </tr>
                            )}
                        )
                    }
                </tbody>
            </table>
		</>
	);
}
