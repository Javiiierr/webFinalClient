import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { cartListAtom } from '@/atoms/cartAtom';
import { favouriteListAtom } from '@/atoms/favouritesAtom';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import { Button, Container, Image } from 'react-bootstrap';

export default function Favourites() {
  const [cartList, setCartList] = useAtom(cartListAtom); // get cart list
  const [favList, setFavList] = useAtom(favouriteListAtom); // get favourite list
  const [cookies, setCookie, removeCookie] = useCookies([]); // get jwt cookie from browser
  const [userName, setUserName] = useState();
  const router = useRouter();

  // runs whenever the jwt token changes
  useEffect(() => {
    const verifyUser = async () => {
      if (!localStorage.getItem('jwt')) { // if no token found, send user to login
        router.push("./login");
      } else {
        const res = await fetch(`https://elegant-pear-coat.cyclic.app`, { // makes a POST request to http://localhost:8080 to validate jwt token with server/Middlewares/Auth
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token: localStorage.getItem('jwt') }) // Send JWT token in the request body
        });
        const data = await res.json();
        if (!data.status) { // if invalid token
          localStorage.removeItem('jwt');
          router.push("./login");
        } else { // set username from response to be displayed in favourites header
          setUserName(data.user);
        }
      }
    };
    verifyUser();
  }, [router, typeof window !== 'undefined' && localStorage.getItem('jwt')]);

  // calls when user clicks remove button
  const removeFromFavourites = (indexToRemove) => {
    setFavList((prevFavList) => {
      return prevFavList.filter((_, index) => index !== indexToRemove); // removes game from list
    });
  };

  // create new list, add product to list, set state to new list
  function addToCart(product) {
    let newCartList = Object.assign([], cartList);
    newCartList.push(product);
    setCartList(newCartList);
  }

  // shows product details when show more button is pressed 
  const toggleExpanded = (index) => {
    setFavList((prevFavList) => {
      const newFavList = [...prevFavList];
      newFavList[index].expanded = !newFavList[index].expanded;
      return newFavList;
    });
  };

  return (
    <Container>
      <h2>{userName}&apos;s Favourites</h2>
      {favList.map((product, index) => (
        <Container className={`product-box ${product.expanded ? 'expanded' : ''}`} key={index}>
          <h3>{product.name}</h3>
          <Image src={product.background_image} alt={product.name} style={{ width: '100px', height: '100px' }} />
          <br /><br />
          <Container className="product-details">
            {product.expanded && (
              <>
                {product.rating}/5 Stars<br /><br />
                Price: {product.price}<br /><br />
                {product.details}<br /><br />
                {product.sellPlatforms.length > 0 && (
                  <Container>
                    <p>Platforms: {product.sellPlatforms.map(platform => platform.name).join(', ')}</p>
                  </Container>
                )}
              </>
            )}
          </Container>
          <Button onClick={() => removeFromFavourites(index)}>Remove</Button>
          <br /><br />
          {product.price !== 'Price not available' && (
            <Button onClick={() => addToCart(product)}>Add to Cart</Button>
          )}
          <Button onClick={() => toggleExpanded(index)}>{product.expanded ? 'Show Less' : 'Show More'}</Button>
        </Container>
      ))}
    </Container>
  )
}
