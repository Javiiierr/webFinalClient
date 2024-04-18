import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { cartListAtom } from '@/atoms/cartAtom';
import { Container, Form, FormLabel, Image, Button, Alert } from 'react-bootstrap';

export default function OrderForm() {
  const [cartList, setCartList] = useAtom(cartListAtom);
  const [expiryError, setExpiryError] = useState(false); // error if credit card is expired
  const [orderConfirmed, setOrderConfirmed] = useState(false); // form submission went through
  const [formData, setFormData] = useState({ // data form the form
    email: '',
    paymentMethod: 'creditCard',
    paypalEmail: '',
    cardNumber: '',
    expiryDate: '',
    cardName: '',
    cvv: ''
  });

  // called whenever any text part of the form is changed
  // updates form state to whatevers in the text box
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // called when user submits form
  const handleSubmit = (e) => {
    e.preventDefault(); // prevents the default behaviour when submitting a form, allows for custom behaviour 
    if (formData.paymentMethod === 'creditCard') { // check if credit card is expired
      const currentDate = new Date();
      const expiryDate = new Date(formData.expiryDate);
      if (expiryDate < currentDate) {
        setExpiryError(true); // set error to true if it is
        return;
      }
    }
    setOrderConfirmed(true); // confirm order and clear cart if information is good
    setCartList([])
  };

  // shows all game cover art in cart and price total
  // next shows form with email, payment method, payment method details
  // shows receipt if order is confrimed
  return (
    <Container className='checkout-content'>
      {!orderConfirmed ? (
        <Container>
          {cartList.map((product, index) => (
            <a key={index}>
              <Image src={product.background_image} alt={product.name} style={{ width: '100px', height: '100px' }} />
            </a>
          ))}
          <br /><strong>Total: ${cartList.reduce((total, prod) => total + prod.price, 0).toFixed(2)}</strong>

          <Form onSubmit={handleSubmit}>
            <FormLabel>Email:</FormLabel>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} required />
            <Form.Check
              type="radio"
              name="paymentMethod"
              value="creditCard"
              label="Credit Card"
              checked={formData.paymentMethod === 'creditCard'}
              onChange={handleInputChange}
            />
            <Form.Check
              type="radio"
              name="paymentMethod"
              value="paypal"
              label="PayPal"
              checked={formData.paymentMethod === 'paypal'}
              onChange={handleInputChange}
            />
            {formData.paymentMethod === 'paypal' ? (
              <Container>
                <FormLabel>PayPal Email:</FormLabel>
                <Form.Control type="email" name="paypalEmail" value={formData.paypalEmail} onChange={handleInputChange} required />
              </Container>
            ) : (
              <Container>
                <FormLabel>Card Number:</FormLabel>
                <Form.Control type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} required />
                <FormLabel>Expiry Date:</FormLabel>
                <Form.Control type="text" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} required />
                <FormLabel>Name on Card:</FormLabel>
                <Form.Control type="text" name="cardName" value={formData.cardName} onChange={handleInputChange} required />
                <FormLabel>CVV:</FormLabel>
                <Form.Control type="text" name="cvv" value={formData.cvv} onChange={handleInputChange} required />
                {expiryError && <Alert variant="danger">Expiry date has already passed.</Alert>}
              </Container>
            )}
            <Button style={{margin:'20px', height: '50px', width: '200px', fontSize: '25px' }} type="submit">Pay Now</Button>
          </Form>
        </Container>
      ) : (
        <Container>
          <h2>Order Confirmed</h2>
          {formData.paymentMethod === 'paypal' ? (
            <Container>
              <p>Receipt sent to: {formData.email}</p>
              <p>Total charged to: {formData.paypalEmail}</p>
            </Container>
          ) : (
            <Container>
              <p>Receipt sent to: {formData.email}</p>
              <p>Card Details</p>
              <p>Card Number: {formData.cardNumber}</p>
              <p>Card Name: {formData.cardName}</p>
              <p>Expiry Date: {formData.expiryDate}</p>
              <p>CVV: {formData.cvv}</p>
            </Container>
          )}
        </Container>
      )}
    </Container>
  );
}
