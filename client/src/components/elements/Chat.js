import React from 'react';
import styled from 'styled-components';
import { Form as FinalForm, Field as FinalField } from 'react-final-form';
import { TextField } from 'final-form-material-ui';
import { Button, Grid } from '@material-ui/core';

import Loader from './Loader';
import arr_up from '../../assets/arrow-up.png';
import arr_down from '../../assets/arrow-down.png';

const posts = ['asdasd', 'asdgeqw', 'awdawd'];

class Chat extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isUp: false,
      messages: [],
      // thread,
    };
  }

  // async componentDidMount() {
  //   const box = await Box.openBox(accounts[0], web3.currentProvider);
  //   const space = await box.openSpace(accounts[0]);
  //   const thread = await space.joinThread('unisaur-thread');
  //   this.setState({ thread });
  //   thread.onUpdate(upd => console.log('thread update', upd));
  // }

  static async getDerivedStateFromProps(nextProps, prevState) {
    const messages = await nextProps.thread.getPosts();
    if (prevState.messages.length !== messages.length) {
      return { messages };
    }
    return null;
  }

  onUpChange = () => {
    this.setState({ isUp: !this.state.isUp });
  };

  render() {
    const { thread, color } = this.props;
    const { messages, isUp } = this.state;

    return (
      <FixedContainer isUp={isUp} color={color}>
        <Header color={color} onClick={this.onUpChange}>
          <Img src={isUp ? arr_down : arr_up} />
        </Header>
        {(messages && messages.map((el, i) => <Post key={i}>{el}</Post>)) || <Loader />}
        {isUp && <Form thread={thread} />}
      </FixedContainer>
    );
  }
}

const Form = ({ thread }) => {
  const _handleFormSubmit = React.useCallback(({ message }) => {
    console.log('SUBMIT >>>', message, Object.keys(thread));
    thread.post(message);
  }, []);

  return (
    <Input>
      <FinalForm onSubmit={_handleFormSubmit}>
        {({ handleSubmit, submitting, pristine }) => (
          <Grid component="form" container onSubmit={handleSubmit} width="100%">
            <Grid item>
              <FinalField name="message" component={TextField} />
            </Grid>
            <Grid item>
              <Button type="submit" variant="contained" color="primary">
                >
              </Button>
            </Grid>
          </Grid>
        )}
      </FinalForm>
    </Input>
  );
};

const FixedContainer = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  height: ${({ isUp }) => (isUp && '400px') || 'unset'};
  width: 300px;
  background: #21a5b7;
  border: 3px solid ${({ color }) => color || 'yellow'};
`;

const Post = styled.p`
  padding: 0.5em;
  font-size: 1em;
  background-color: white;
  border-radius: 10px;
  margin: 1em;
`;

const Header = styled.h3`
  background-color: ${({ color }) => color || 'yellow'};
  margin: 0;
  padding: 0;
  cursor: pointer;
`;

const Img = styled.img`
  width: 20px;
  height: 20px;
`;
const Input = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`;

export default Chat;
