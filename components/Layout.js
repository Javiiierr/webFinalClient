import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { cartListAtom } from '@/atoms/cartAtom';
import { favouriteListAtom } from '@/atoms/favouritesAtom';
import { useRouter } from 'next/router';
import { Button, Container, Navbar, Nav } from 'react-bootstrap';
import Link from 'next/link';
import Searchbar from '@/components/Searchbar'

export default function Layout(props) {
  const [cartList, setCartList] = useAtom(cartListAtom); // needed to show length of cart
  const [favList, setFavList] = useAtom(favouriteListAtom); // needed to show length of favourites
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  // runs everytime the jwt token changes
  useEffect(() => {
    // if jwt token is found the user is logged in, if not they are logged out
    if (!localStorage.getItem('jwt')) {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, [typeof window !== 'undefined' && localStorage.getItem('jwt')]);

  // called by the Log Out button
  const logOut = () => {
    localStorage.removeItem("jwt"); // clears jwt cookie
    setCartList([]) // clear cart
    setFavList([]) // clear favourites
    setLoggedIn(false);
    router.push("../login");
  }

  // if logged in show log out button, if logged out show log in and sign up links, 
  // then show navbar, platforms, search bar component, and the rest of the page
  return (
    <>
      <Navbar expand="lg">
        <Container>
          <Link href="../" className="brand-link" >
            <Navbar.Brand className="brand-link">GameList</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {loggedIn ? (
                <Button onClick={logOut}>Log Out</Button>
              ) : (
                <>
                  <Link href="../login" className="layout-link"><span>Login</span></Link>
                  <Link href="../signup" className="layout-link"><span>Sign Up</span></Link>
                </>
              )}
              <Link href="../catalogue" className="layout-link"><span>Catalogue</span></Link>
              <Link href="../favourites" className="layout-link"><span>Favourites ({favList.length})</span></Link>
              <Link href="../viewCart" className="layout-link"><span>Shopping Cart ({cartList.length})</span></Link>

            </Nav>
            <Nav>
              <Searchbar />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="childBox">
        {props.children}
      </Container>
    </>
  );
}