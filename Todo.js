import React, { useState, useCallback } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    TextInput
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
//checkbox-blank-outline

const { width, height } = Dimensions.get('window');
const CIRCLE_RADIUS = 16;
const ICON_SIZE = 27;
const MAX_TODO_LEN = 14;

const Todo = ({ id, text, isComplete, deleteTodo, completeTodo, uncompleteTodo, updateTodo }) => {
    const [editMode, setEditMode] = useState(false);
    // const [complete, setComplete] = useState(isComplete);
    const [editValue, setEditValue] = useState(text);

    const toggleComplete = id => {
        // console.log('dfdf');
        if ( isComplete ) {
            uncompleteTodo(id);
        } else {
            completeTodo(id);
        }
    }
    const startEditting = () => {
        // setEditValue(text);
        setEditMode(true);
    }
    const endEditting = () => {
        // setEditValue()
        updateTodo(id, editValue);
        setEditMode(false);
    }
    const onChangeText = (text) => {
        setEditValue(text);
    }

    return (
        <View style={styles.container}>
            <View style={styles.column}>
                <TouchableOpacity onPress={() => toggleComplete(id)}>
                    {/* <MaterialCommunityIcons name='checkbox-blank-outline' size={32}></MaterialCommunityIcons> */}
                    <View style={[
                        styles.circle,
                        isComplete ? styles.completedCircle : styles.uncompltedCircle
                    ]}/>
                </TouchableOpacity>
                {editMode ?
                    (<TextInput
                        value={editValue}
                        multiline={true}
                        style={[
                            styles.input,
                            styles.text,
                            isComplete ? styles.completedText : styles.uncompltedText
                        ]}
                        onChangeText={onChangeText}
                        returnKeyType={'done'}
                        onBlur={endEditting}
                    />
                    ) : (
                    <Text
                        style={[
                            styles.text, 
                            isComplete ? styles.completedText : styles.uncompltedText
                            ]}>
                        {editValue.length > MAX_TODO_LEN ? editValue.slice(0, MAX_TODO_LEN) + '...' : editValue}
                    </Text>
                    )}
            </View>
            {editMode ?
                (<View style={styles.actions}>
                    <TouchableOpacity onPress={endEditting}>
                        <View style={styles.actionContainer}>
                            <MaterialCommunityIcons name='checkbox-marked' size={ICON_SIZE} />
                        </View>
                    </TouchableOpacity>
                </View>) :
                (<View style={styles.actions}>
                    <TouchableOpacity onPress={startEditting}>
                        <View style={styles.actionContainer}>
                            <MaterialCommunityIcons name='pencil-box-outline' size={ICON_SIZE} color='#900B3D' />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteTodo(id)}>
                        <View style={styles.actionContainer}>
                            <MaterialCommunityIcons name='delete' size={ICON_SIZE} color='#571745' />
                        </View>
                    </TouchableOpacity>
                </View>)}
        </View>
    )
}

Todo.propTypes = {
    id: PropTypes.string.isRequired,
    isComplete: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    deleteTodo: PropTypes.func.isRequired,
    completeTodo: PropTypes.func.isRequired,
    uncompleteTodo: PropTypes.func.isRequired,
    updateTodo: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
    container: {
        width: width - 60,
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'black'
    },
    text: {
        fontSize: 23,
        fontWeight: '100',
        marginVertical: 12,
        marginLeft: 5,
    },
    completedText: {
        color: '#bbb',
        textDecorationLine: 'line-through'
    },
    uncompltedText: {
        color: '#353839'
    },
    circle: {
        width: CIRCLE_RADIUS * 2,
        height: CIRCLE_RADIUS * 2,
        borderRadius: CIRCLE_RADIUS,
        backgroundColor: 'white',
        borderWidth: 4,
    },
    completedCircle: {
        borderColor: '#bbb',
    },
    uncompltedCircle: {
        borderColor: '#FE8C3B',
    },
    column: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width / 2,
    },
    actions: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    actionContainer: {
        marginVertical: 10,
        marginHorizontal: 6,
        // paddingHorizontal: 5
    },
    input: {
        width: ( width / 2 ) + 10,
    }
})

export default Todo;