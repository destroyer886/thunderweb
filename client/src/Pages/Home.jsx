import React, { Component } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #e7e4f3, #928dab);
  font-family: 'Poppins', sans-serif;
`;

const Card = styled.div`
  background: #fff;
  padding: 2rem 3rem;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  text-align: center;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #1f1c2c;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #555;
  margin-top: 0;
`;

export class Home extends Component {
  render() {
    return (
      <Wrapper>
        <Card>
          <Title>🚀 Starter Template</Title>
          <Subtitle>This is your styled starter template</Subtitle>
        </Card>
      </Wrapper>
    );
  }
}

export default Home;
