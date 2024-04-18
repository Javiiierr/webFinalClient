import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { cartListAtom } from '../atoms/cartAtom';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import { Button, Container, Image } from 'react-bootstrap';

export default function Cart() {
  const [cartList, setCartList] = useAtom(cartListAtom); // get cart list
  const [cookies, setCookie, removeCookie] = useCookies([]); // get jwt cookie from browser
  const [userName, setUserName] = useState();
  const router = useRouter();

  // called when cookies change, used to protect route
  useEffect(() => {
    const verifyUser = async () => {
      console.log(cookies.jwt)
      console.log(document.cookie)
      if (!cookies.jwt) { // if no cookie found, send user to login
        router.push("./login")
      } else { // makes a POST request to http://localhost:8080 to validate jwt token with server/Middlewares/Auth
        const res = await fetch(`https://web-final-server.vercel.app`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        const data = await res.json();
        if (!data.status) { // if invalid token
          removeCookie("jwt");
          router.push("./login");
        } else {
          setUserName(data.user); // set username from response to be displayed in cart header
        }
      }
    }
    verifyUser()
  }, [cookies, router, removeCookie])

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