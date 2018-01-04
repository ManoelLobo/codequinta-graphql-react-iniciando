import React, { Component, Fragment } from 'react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

class TodoList extends Component {
  state = {
    newTodoText: '',
  }

  addTodo = () => {
    const { newTodoText } = this.state;

    this.props.addTodo({
      variables: { text: newTodoText },
      update: (proxy, { data: { createTodo } }) => {
        this.props.todos.refetch();
      },
    })
  };

  removeTodo = (id) => {
    this.props.removeTodo({
      variables: { id },
      update: (proxy, { data: { deleteTodo } }) => {
        this.props.todos.refetch();
      },
    });
  }

  renderTodoList = () => (
    <ul>
      { this.props.todos.allTodoes.map(todo =>
        <li key={todo.id}>{todo.text} <i title="Remover" onClick={() => {this.removeTodo(todo.id)}}>X</i></li>
      )}
    </ul>
  )

  render() {
    const { todos } = this.props;

    return (
      <Fragment>
        { todos.loading
          ? <p>Carregando...</p>
          : this.renderTodoList() }

        <input
          type="text"
          value={this.state.newTodoText}
          onChange={e => this.setState({ newTodoText: e.target.value })}
        />
        <input type="submit" value="Criar" onClick={this.addTodo} />
      </Fragment>
    );
  }
}

const TodosQuery = gql`
  query {
    allTodoes {
      id
      text
      # completed
    }
  }
`;

const TodoMutation = gql`
  mutation ($text: String!) {
    createTodo ( text: $text ) {
      id
      text
      # completed
    }
  }
`;

const TodoRemoval = gql`
  mutation ($id: ID!) {
    deleteTodo (id: $id) {
      id
      text
    }
  }
`;

export default compose(
  graphql(TodosQuery, { name: 'todos' }),
  graphql(TodoMutation, { name: 'addTodo' }),
  graphql(TodoRemoval, { name: 'removeTodo' }),
)(TodoList);
