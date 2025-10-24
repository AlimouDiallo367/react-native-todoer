import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableHighlight, ScrollView, Switch, Button, Text, TextInput } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ToastManager, { Toast } from 'toastify-react-native';
import { Dialog } from 'react-native-simple-dialogs';
import { Ionicons } from '@expo/vector-icons';

function TodoItem({ todo, isLast, setToggling }) {
  return (
    <TouchableHighlight onPress={() => setToggling(todo)}>
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          paddingVertical: 16,
          paddingHorizontal: 8,
          backgroundColor: 'white',
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: 'lightgray',
        }}
      >
        <Ionicons
          name="checkmark-circle"
          size={22}
          color={todo.done ? 'green' : 'lightgray'}
        />
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Text style={[styles.text, { fontWeight: 'bold' }]}>{todo.name}</Text>
          {!!todo.description && <Text style={styles.text}>{todo.description}</Text>}
        </View>
      </View>
    </TouchableHighlight>
  );
}

export default function App() {
  const EMPTY_TODO = () => ({
    name: '',
    done: false,
    description: '',
  });

  const SEED_COUNT = 4;
  const SEED = [...Array(SEED_COUNT).keys()].map((item) => {
    const name = `Todo ${item}`;
    return {
      id: Math.random().toString(16).substring(2),
      name: name,
      description: `Description ${name} `.repeat(item),
      done: item % 3 === 0,
    };
  });

  const [todos, setTodos] = useState(SEED);
  const [newTodo, setNewTodo] = useState(EMPTY_TODO());
  const [toggling, setToggling] = useState(null);

  // --- Ajouter un todo ---
  function add() {
    if ((newTodo.name?.trim() ?? '') === '') {
      Toast.error('Provide a Todo name', 'bottom');
      return;
    }

    setTodos([{ ...newTodo, id: Math.random().toString(16).substring(2) }, ...todos]);
    setNewTodo(EMPTY_TODO());
  }

  // --- Toggle done ---
  function toggle(id) {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  // --- Supprimer todo ---
  function remove(id) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  // --- Liste de todos ---
  function list() {
    if (todos.length === 0) {
      return (
        <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 48, color: 'gray' }}>No todos...</Text>
        </View>
      );
    }

    return (
      <ScrollView style={{ flexGrow: 1 }}>
        {todos.map((todo, index) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isLast={index + 1 === todos.length}
            setToggling={setToggling}
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <ToastManager />

      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center' }}>Todoer Starter</Text>

          {/* Formulaire */}
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <TextInput
              style={[styles.input, { height: 48, flexGrow: 1 }]}
              placeholder="New task"
              value={newTodo.name}
              onChangeText={(text) => setNewTodo({ ...newTodo, name: text })}
            />
            <Switch
              value={newTodo.done}
              onValueChange={(checked) => setNewTodo({ ...newTodo, done: checked })}
            />
          </View>

          <TextInput
            style={[styles.input, { width: '100%', height: 96, verticalAlign: 'top' }]}
            placeholder="Optional description"
            multiline
            value={newTodo.description}
            onChangeText={(text) => setNewTodo({ ...newTodo, description: text })}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 8 }}>
            <Button title="Add" color="green" onPress={add} />
          </View>

          {list()}

          {/* Dialog pour toggle + supprimer */}
          <Dialog
            title={toggling?.name}
            visible={!!toggling}
            onTouchOutside={() => setToggling(null)}
            animationType="fade"
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16 }}>
              <Button title="Cancel" color="gray" onPress={() => setToggling(null)} />
              <Button
                title={toggling?.done ? 'Incomplete' : 'Completed'}
                onPress={() => {
                  toggle(toggling?.id);
                  setToggling(null);
                }}
              />
              <Button
                title="Delete"
                color="red"
                onPress={() => {
                  remove(toggling?.id);
                  setToggling(null);
                }}
              />
            </View>
          </Dialog>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 8,
  },
  text: {
    fontSize: 18,
  },
});

