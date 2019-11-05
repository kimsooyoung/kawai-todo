import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  Platform,
  ScrollView
} from 'react-native';
import Todo from './Todo';
import { AppLoading } from 'expo';
import uuidv1 from 'uuid/v1';

const { width, height } = Dimensions.get('window');

const App = () => {
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState({});

  const onChangeText = (text) => {
    setNewTodo(text);
  }
  const loadTodos = () => {
    // loading in here
    setLoading(false);
  }
  const addTodo = () => {
    if (newTodo !== '') {
      console.log(newTodo);
      const id = uuidv1();
      const tempTodo = {
        [id]: {
          id,
          complete: false,
          text: newTodo,
          createdAt: Date.now()
        }
      }
      setTodos( prevTodos => {
        return { ...prevTodos, ...tempTodo }
      });
      setNewTodo('');
    }
  }
  const deleteTodo = id => {
    setTodos(prevTodo => {
      const tempTodo = prevTodo;
      delete tempTodo[id];
      return { ...tempTodo };
    });
  }
  const completeTodo = id => {
    setTodos(prevTodo => {
      const tempTodo = {
         ...prevTodo,
         [id]: {
           ...prevTodo[id],
           complete: true
         }
      }
      return { ...tempTodo }
    })
  }
  const uncompleteTodo = id => {
    setTodos(prevTodo => {
      const tempTodo = {
         ...prevTodo,
         [id]: {
           ...prevTodo[id],
           complete: false
         }
      }
      return { ...tempTodo }
    })
  }
  const updateTodo = ( id, text ) => {
    setTodos(prevTodo => {
      const tempTodo = {
        ...prevTodo,
        [id]: {
          ...prevTodo[id],
          text: text
        }
      }
      return { ...tempTodo }
    })
  }
  // 수정 버튼 클릭하면 자동 포커스 되게 만들어 보기!!
  // const useFocus = () => {
  //   const element = useRef();    
  //   useEffect( () => {
  //     if( element.current ){
  //       element.current.addEventListener('click', element.current.focus());
  //     }
  //     return () => {
  //       if( element.current){
  //         element.current.removeEventListener('click', element.current.focus());
  //       }
  //     }
  //   }, [])

  //   return element
  // }

  useEffect(() => {
    loadTodos();
  }, [])

  if (loading) {
    return <AppLoading />
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content'></StatusBar>
      <Text style={styles.title}>Kawai Todo!</Text>
      <View style={styles.card}>
        <TextInput
          value={newTodo}
          style={styles.input}
          placeholder='할 일...'
          placeholderTextColor="#999"
          onChangeText={onChangeText}
          returnKeyType={"done"}
          autoCorrect={false}
          onSubmitEditing={addTodo}>
        </TextInput>
        <ScrollView contentContainerStyle={styles.todos}>
          {Object.values(todos).map(todo =>
            <Todo
              key={todo.id}
              {...todo}
              isComplete={todo.complete}
              deleteTodo={deleteTodo}
              completeTodo={completeTodo}
              uncompleteTodo={uncompleteTodo}
              updateTodo={updateTodo}
            />
          )}
          <Text>{JSON.stringify(todos)}</Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD939', //나중에 gradient로 바꿉시다. ㅇㅇㅇ 
    alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    color: '#353839',
    fontSize: 40,
    marginTop: 57,
    fontWeight: '500',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    width: width - 30,
    flex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(50, 50, 50)',
        shadowOpacity: .5,
        shadowRadius: 5,
        shadowOffset: {
          width: 0,
          height: -1
        }
      },
      android: {
        elevation: 9
      }
    })
  },
  input: {
    padding: 20,
    fontSize: 20,
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  todos: {
    alignItems: 'center',
  }
});


export default App;