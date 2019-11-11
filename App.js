import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  Platform,
  ScrollView,
  AsyncStorage,
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
  const loadTodos = async () => {
    // loading in here
    try {
      const getTodo = await AsyncStorage.getItem('todos');
      const parseTodo = JSON.parse(getTodo);
      setTodos(parseTodo);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  const saveTodo = currnetTodo => {
    const saving = AsyncStorage.setItem('todos', JSON.stringify(currnetTodo));
  }
  const addTodo = () => {
    if (newTodo !== '') {
      console.log(newTodo);
      const id = uuidv1();
      const tempTodo = {
        [id]: {
          id: id,
          complete: false,
          text: newTodo,
          createdAt: Date.now()
        }
      }
      setTodos( prevTodo => {
        saveTodo( { ...prevTodo, ...tempTodo } );
        return { ...prevTodo, ...tempTodo }
      });
      setNewTodo('');
    }
  }
  const deleteTodo = id => {
    setTodos(prevTodo => {
      const tempTodo = prevTodo;
      delete tempTodo[id];
      saveTodo( todos );
      return { ...tempTodo };
    });
  }
  const completeTodo = id => {
    const tempTodo = {
      ...todos,
      [id]: {
        ...todos[id],
        complete: true
      }
    }
    // console.log( tempTodo );
    saveTodo( tempTodo );
    setTodos( tempTodo );
  }
  const uncompleteTodo = id => {
    const tempTodo = {
       ...todos,
       [id]: {
         ...todos[id],
         complete: false
       }
    }
    // console.log( tempTodo );
    saveTodo( tempTodo );
    setTodos( tempTodo );
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
      saveTodo( tempTodo );
      return { ...tempTodo };
    })
  }
  // 수정 버튼 클릭하면 자동 포커스 되게 만들어 보기!!
  // const useFocus = onClick => {
  //   const element = useRef();
  //   useEffect( () => {
  //     if( element.current ){
  //       element.current.addEventListener('click', onClick);
  //     }
  //     return () => {
  //       if( element.current){
  //         element.current.removeEventListener('click', onClick);
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
          {console.log('-----------------------', todos)}
          {todos === null ? (null):(
            Object.values(todos).sort( ( a, b ) => {
              return a.createdAt - b.createdAt
            }).map(item => {
            // console.log(item);
            return <Todo
              key={item.id}
              id={item.id}
              isComplete={item.complete}
              deleteTodo={deleteTodo}
              uncompleteTodo={uncompleteTodo}
              completeTodo={completeTodo}
              updateTodo={updateTodo}
              text={item.text}
              // {...item}
            />}
          ))}
          {/* <Text>{JSON.stringify(todos, undefined, 2)}</Text> */}
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