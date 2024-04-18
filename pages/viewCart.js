import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { cartListAtom } from '../atoms/cartAtom';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import { Button, Container, Image } from 'react-bootstrap';

export default function Cart() {
  const [cartList, setCartList] = useAtom(cartListAtom); // get cart list
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
  const removeFromCart = (indexToRemove) => {
    setCartList((prevCartList) => {
      return prevCartList.filter((_, index) => index !== indexToRemove); // remove game from list
    });
  };

  // shows username, all game images and price from cart
  // if cart isnt empty show total and checkout link
  return (
    <Container>
      <h2>{userName}&apos;s Cart</h2>

      <Container className="cart">
        {cartList.map((product, index) => (
          <Container className="cart-item" key={index}>
            <ul key={index}>
              <strong>{product.name}</strong><br />
              <Image src={product.background_image} alt={product.name} style={{ width: '100px', height: '100px', marginRight: '10px' }} /><br /><br />
              ${product.price.toFixed(2)}
              <Button onClick={() => removeFromCart(index)}>Remove</Button>
            </ul>
          </Container>
        ))}
        <hr />
        {cartList.length > 0 && (
          <ul>
            <strong>Total: ${cartList.reduce((total, prod) => total + prod.price, 0).toFixed(2)}</strong> <br></br>
            <br></br>
            <Button style={{ height: '50px', width: '120px', fontSize: '20px' }} onClick={() => router.push("./checkout")}>Checkout</Button>
          </ul>
        )}

      </Container>
    </Container>
  )
}