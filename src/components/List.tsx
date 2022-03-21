import React, { useState, useEffect, useReducer } from "react";
import "./list.scss";

export default function List() {
	const [baseCoins, setBaseCoins] = React.useState<any[]>([]);
	const [coins, setCoins] = React.useState<any[]>([]);
	const [listSort, setListSort] = React.useState({
        column: "name",
        direction: "asc"
    });

	useEffect(() => {
        fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=aud&order=market_cap_desc&per_page=100&page=1&sparkline=false")
            .then(res => res.json())
            .then((result) => {
                setBaseCoins(result);
                setCoins(result);
            });
	}, [])

    const sortList = (a = '', b = '', direction = 'asc') => {
        if (direction === 'asc') {
            if (a > b) {
                return 1;
            } else if(a < b) {
                return -1;
            } else {
                return 0;
            }
        } else {
            if (b > a) {
                return 1;
            } else if(b < a) {
                return -1;
            } else {
                return 0;
            }
        }
    }

    const orderCoins = (sort = 'market') => {
        let tempCoins = coins;

        let direction = listSort.direction === "asc" ? "desc" : "asc";

        if (sort === 'name') {
            tempCoins.sort((a, b) => {
                return sortList(a.name.toLowerCase(), b.name.toLowerCase(), direction);
            });
        } else if (sort === 'price') {
            tempCoins.sort((a, b) => {
                return sortList(a.current_price, b.current_price, direction);
            });
        } else if (sort === 'market') {
            tempCoins.sort((a, b) => {
                return sortList(a.market_cap, b.market_cap, direction);
            });
        }
        setListSort(listSort => ({
            column: sort,
            direction: direction
        }));
        setCoins([...tempCoins]);
    }

    const searchCoins = (e: React.ChangeEvent<HTMLInputElement>) => {
        let search = e.target.value;

        let tempCoins = baseCoins.filter(function(a) {
            return a.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
        });

        setCoins([...tempCoins]);
    }

	return (
		<>
            <h1>Top 100 Coins</h1>
            <input type="search" placeholder="Search" onChange={e => searchCoins(e)}/>
			<table>
                <thead>
                    <tr>
                        <th></th>
                        <th className={listSort.column === 'name' ? (listSort.direction === 'asc' ? 'sort-asc' : 'sort-desc') : ''} onClick={e => orderCoins('name')}>Coin</th>
                        <th className={listSort.column === 'price' ? (listSort.direction === 'asc' ? 'sort-asc' : 'sort-desc') : ''} onClick={e => orderCoins('price')}>Price</th>
                        <th className={listSort.column === 'market' ? (listSort.direction === 'asc' ? 'sort-asc' : 'sort-desc') : ''} onClick={e => orderCoins('market')}>Market cap</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        !coins ? 
                        <tr>
                            <td></td>
                            <td>Loading...</td>
                            <td></td>
                            <td></td>
                        </tr> 
                        : coins.map((coin, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{coin.name}</td>
                                    <td>${coin.current_price}</td>
                                    <td>${coin.market_cap}</td>
                                </tr>
                            )}
                        )
                    }
                </tbody>
            </table>
		</>
	);
}
