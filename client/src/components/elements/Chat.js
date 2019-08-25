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
    };
  }

  async componentDidMount() {
    this.handleFetchMessages();
    this.props.thread.onUpdate(() => this.handleFetchMessages());
  }

  static async getDerivedStateFromProps(nextProps, prevState) {
    const messages = await nextProps.thread.getPosts();
    if (prevState.messages.length !== messages.length) {
      return { messages };
    }
    return null;
  }

  handleFetchMessages = async () => {
    const messages = await this.props.thread.getPosts();
    this.setState({ messages });
    this.scrollToElementD();
  };

  scrollToElementD = () => {
    let messages = document.getElementsByClassName('msg');
    let topPos = (messages.length && messages[messages.length - 2].offsetTop) || 0;
    document.getElementById('scrollable').scrollTop = topPos - 10;
  };

  onUpChange = () => {
    if (!this.state.isUp) {
      this.handleFetchMessages();
    }
    this.setState({ isUp: !this.state.isUp });
  };

  render() {
    const { thread, color } = this.props;
    const { messages, isUp } = this.state;

    return (
      <FixedContainer id="scrollable" isUp={isUp} color={color}>
        <Header color={color} onClick={this.onUpChange}>
          <Img src={isUp ? arr_down : arr_up} />
        </Header>
        <Posts>
          {isUp &&
            (messages.length &&
              messages.map((el, i) => (
                <Post className="msg" key={i}>
                  {el.message}
                </Post>
              )))}
        </Posts>
        {isUp && <Form thread={thread} />}
      </FixedContainer>
    );
  }
}

const Form = ({ thread }) => {
  const _handleFormSubmit = React.useCallback(({ message }) => thread.post(message), []);

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
  max-height: 400px;
  overflow-y: scroll;
  width: 300px;
  background: #21a5b7;
  border: 3px solid ${({ color }) => color || 'yellow'};
`;

const Posts = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const Post = styled.li`
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
  position: fixed;
  width: 300px;
`;

const Img = styled.img`
  width: 20px;
  height: 20px;
`;
const Input = styled.div`
  position: fixed;
  background-color: #ffffff99;
  bottom: 0;
  right: 0;
`;

export default Chat;
