import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {  Button, Container, Row, Col  } from 'react-bootstrap';
import ProductBox from "@/components/ProductBox";
import Link from 'next/link';

export default function Platforms() {
  const [gameData, setGameData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // needed for pagination
  const router = useRouter();
  const { platform } = router.query; // get platform from [slug]

  // called whenever page or platform changes
  useEffect(() => {
    const fetchData = async () => {
      // search cache if user has visited the page number, if yes set game data to cache
      const cachedData = localStorage.getItem(`${platform}Page_${currentPage}`);
      if (cachedData) {
        setGameData(JSON.parse(cachedData));
        // if nothing in cache
      } else {
        const res = await fetch(`https://api.rawg.io/api/games?key=065460f6fbc3465a8a19dafdc359151f&page_size=12&page=${currentPage}&platforms=${platform}`); // call API to get main game info for current page and platform
        const data = await res.json();
        const gamesWithOverZeroStars = data.results.filter(game => game.rating > 0); // filter literal trash games
        const gamesWithPrices = await fetchPrices(gamesWithOverZeroStars); // add price attribute to games
        const gamesWithDescription = await fetchDetails(gamesWithPrices); // add details attribute to games
        setGameData(gamesWithDescription);
        // Cache the fetched data in localStorage
        localStorage.setItem(`${platform}Page_${currentPage}`, JSON.stringify(gamesWithDescription)); // save results and search to local storage
      }
    };
    fetchData();
  }, [currentPage, platform]);

  // called by useEffect
  const fetchPrices = async (games) => {
    const gamesWithPrices = [];
    await Promise.all( // resolves when everything inside is finished
      games.map(async (game) => {
        //const res = await fetch(`https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(game.name)}`); // call API to get game price
        //const data = await res.json();
        //const price = data.length > 0 ? parseFloat(data[0].cheapest) : 'Price not available';
        const price = 5; // delete later im getting rate limited by the API :(
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

  // called via paginaiton controls
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll screen to start of page
  };

  // if no game data show loading... else show all games with ProductBox in grid form and pagination buttons, Previous is disabled if currentPage is 1
  return (
    <Container>
      <Container className="categories">
        <Link href="../platforms/4" className="layout-link"><span>PC</span></Link>
        <Link href="../platforms/7" className="layout-link"><span>Nintendo Switch</span></Link>
        <Link href="../platforms/18" className="layout-link"><span>Playstation 4</span></Link>
        <Link href="../platforms/1" className="layout-link"><span>Xbox One</span></Link>
      </Container>


      {gameData ? (
        <>
          <Row lg={3}>
            {gameData.map((game) => (
              <Col key={game.id} className="d-flex">
                <ProductBox key={game.id} product={game} />
              </Col>

            ))}
          </Row>
          <Container>
            <Button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</Button>
            <Button onClick={() => handlePageChange(currentPage + 1)}>Next</Button>
          </Container>
        </>

      ) : (
        <p>Loading...</p>
      )}
    </Container>
  );
}
