import React from 'react';
import { Container, Button, Image, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/router';

export default function Index() {
  const router = useRouter();

  // displays image, welcome text and button to catalogue
  return (
    <Container>
      <Row>
        <Col>
          <Image src="\pexels-lulizler-3165335.jpg" alt="Your Image" width={600} height={400} />
        </Col>
        <Col>
          <Container className='welcome-content'>
            <h1 className="jersey-10-regular">Welcome to GameList!</h1>
            <Container className='welcome-text'>
              <p >Explore hundreds of games, add the ones you like to your favorites, and easily buy them!</p>
              <br />
              <p>To get started, click the button below to check out our catalogue.</p>
            </Container>

            <Button style={{ height: '70px', width: '200px', fontSize: '25px' }} onClick={() => router.push("./catalogue")}>Start</Button>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

// Deploy
// Unit testing
// check with instrucitons
// finsih document
