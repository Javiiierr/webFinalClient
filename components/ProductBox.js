import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { cartListAtom } from '@/atoms/cartAtom';
import { favouriteListAtom } from '@/atoms/favouritesAtom';
import { useRouter } from 'next/router';
import { Button, Card, Row, Col } from 'react-bootstrap';

export default function ProductBox(props) {
  const [cartList, setCartList] = useAtom(cartListAtom);
  const [favList, setFavList] = useAtom(favouriteListAtom);
  const [loggedIn, setLoggedIn] = useState(false);
  const { product } = props; // ProductBox is passed a game via props and it is passed into product
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  // runs everytime the jwt token changes
  useEffect(() => {
    // if jwt token is found the user is logged in, if not they are logged out
    if (!localStorage.getItem('jwt')) {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, [typeof window !== 'undefined' && localStorage.getItem('jwt')]);

  // create new list, add product to list, set state to new list
  function addToCart(product) {
    if (!loggedIn) router.push("../login") // if user isn't logged in, send them to login
    else {
      let newCartList = Object.assign([], cartList);
      newCartList.push(product);
      setCartList(newCartList);
    }
  }

  // create new list, add product to list, set state to new list
  function addToFavourites(product) {
    if (!loggedIn) router.push("../login") // if user isn't logged in, send them to login
    else { 
      let newFavouritesList = Object.assign([], favList);
      newFavouritesList.push(product);
      setFavList(newFavouritesList);
    }
  }

  // display name, image, stars, rating, description, platforms if there are any if user shows more details, and AddToFavourite button
  // do not show AddToCart button if price is not available
  // displays in grid form
  return (
    <Row className="product-card-row">
      <Col xs={12} sm={6} md={4} lg={3}>
        <Card className={`product-box ${expanded ? 'expanded' : ''}`}>
          <Card.Img variant="top" src={product.background_image} alt={product.name} />
          <Card.Body>
            <Card.Title>{product.name}</Card.Title>
            <Card.Text>{expanded && product.details}</Card.Text>
            {expanded && (
              <>
                <p>{product.rating}/5 Stars</p>
                <p>Price: {product.price}</p>
                {product.sellPlatforms.length > 0 && (
                  <p>Platforms: {product.sellPlatforms.map(platform => platform.name).join(', ')}</p>
                )}
              </>
            )}
            <Button onClick={() => addToFavourites(product)}>Add to Favourites</Button>
            {product.price !== 'Price not available' && (
              <Button onClick={() => addToCart(product)}>Add to Cart</Button>
            )}
            <br></br>
            <br></br>
            <Button onClick={() => setExpanded(!expanded)}>{expanded ? 'Show Less' : 'Show More'}</Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}