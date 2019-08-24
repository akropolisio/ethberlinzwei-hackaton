import React from 'react';
import styled from 'styled-components';
import { Loader } from '.';

const posts = ['asdasd', 'asdgeqw', 'awdawd'];

const Chat = ({ thread, color }) => {
  return (
    <FixedContainer color={color}>
      <Header color={color} />
      {(posts && posts.map((el, i) => <Post key={i}>{el}</Post>)) || <Loader />}
    </FixedContainer>
  );
};

const FixedContainer = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  height: 30vh;
  width: 10vw;
`;

const Post = styled.p`
  padding: 0.5em;
  font-size: 1em;
`;

const Header = styled.div``;

export default Chat;
