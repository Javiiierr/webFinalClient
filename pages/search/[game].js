import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col} from 'react-bootstrap';
import ProductBox from "@/components/ProductBox";

export default function Search() {
  const [gameData, setGameData] = useState(null);
  const [error, setError] = useState(false);
  const router = useRouter();
  const { game } = router.query; // get game from [slug]

  // called whenever [game] is changed
  useEffect(() => {
    const fetchData = async () => {
      try {
        // search cache if user has searched for [game], if yes set game data to cache
        const cachedData = localStorage.getItem(`search_${game}`);
        if (cachedData) {
          setGameData(JSON.parse(cachedData));
        }
        // if nothing in cache
        else {
          const res = await fetch(`https://api.rawg.io/api/games?key=065460f6fbc3465a8a19dafdc359151f&search=${game}`); // call API to get main game info
          if (!res.ok) { // throw error is response errored
            throw new Error('Failed to fetch data');
          }
          // if response ok
          const data = await res.json();
          const gamesWithOverZeroStars = data.results.filter(game => game.rating > 0); // filter literal trash games
          const gamesWithPrices = await fetchPrices(gamesWithOverZeroStars); // add price attribute to games
          const gamesWithDescription = await fetchDetails(gamesWithPrices); // add details and sellPlatfroms attribute to games
          setGameData(gamesWithDescription);
          localStorage.setItem(`search_${game}`, JSON.stringify(gamesWithDescription)); // save results and search to local storage
        }
      }
      catch (error) { // catch thrown error and set error to true
        setError(true);
      }
    };
    fetchData();
  }, [game]);

  // called by useEffect
  const fetchPrices = async (games) => {
    const gamesWithPrices = [];
    await Promise.all( // resolves when everything inside is finished
      games.map(async (game) => {
        const res = await fetch(`https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(game.name)}`); // call API to get game price
        const data = await res.json();
        const price = data.length > 0 ? parseFloat(data[0].cheapest) : 'Price not available';
        gamesWithPrices.push({ ...game, price }); // adds a new price attribute to all games
      })
    );
    return gamesWithPrices;
  };

  // called by useEffect
  const fetchDetails = async (games) => {
    const gamesWithDescription = [];
    await Promise.all( // resolves when everything inside is finished
      games.map(async (game) => {
        const res = await fetch(`https://api.rawg.io/api/games/${game.id}?key=065460f6fbc3465a8a19dafdc359151f`); // call API to get game details
        const data = await res.json();
        const details = data.description_raw || 'No description found'; // add description to games
        const sellPlatforms = data.platforms
          .filter(platform => [1, 4, 7, 18].includes(platform.platform.id))
          .map(platform => ({
            id: platform.platform.id,
            name: platform.platform.name
          })); // if platforms list has PC, Ebox One, Playstation 4, or Nintendo Switch, add the name and id to the new attribute
        gamesWithDescription.push({ ...game, details, sellPlatforms }); // adds new details and sellPlatforms attribute to all games
      })
    );
    return gamesWithDescription;
  };

  // If error display 0 results, if game data show search resuls, else show loading...
  // if game data then show all the games with ProductBox in grid form
  return (
    <Container>
      <h2>{error ? `0 search results for ${game}` : gameData ? `Search results for: ${game}` : 'Loading...'}</h2>
      {gameData && !error && (
        <Row lg={3}>
          {gameData.map((game) => (
             <Col key={game.id} className="d-flex">
                <ProductBox product={game} />
             </Col>
          ))}
        </Row>
      )} 
    </Container>
  );
}