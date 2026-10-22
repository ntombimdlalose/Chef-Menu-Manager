import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  useWindowDimensions,
} from 'react-native';

import { Dropdown } from 'react-native-element-dropdown';

export default function App() {
  const [course, setCourse] = useState('');
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const { width } = useWindowDimensions();
const gridColumns = 2;
const gridItemWidth = (width - 44) / gridColumns;


  const courseOptions = [
    { label: 'Starter', value: 'Starter' },
    { label: 'Main Course', value: 'Main Course' },
    { label: 'Dessert', value: 'Dessert' },
  ];

  const clearForm = () => {
    setDishName('');
    setDescription('');
    setCourse('');
    setPrice('');
    setEditingId(null);
  };

  const addMenuItem = () => {
    if (
      dishName.trim() === '' ||
      description.trim() === '' ||
      !course ||
      price.trim() === ''
    ) {
      Alert.alert('Missing Information', 'Please complete all fields.');
      return;
    }

    const priceNumber = Number(price.replace(/R/gi, '').trim());

    if (!Number.isFinite(priceNumber) || priceNumber < 0) {
      Alert.alert(
        'Invalid Price',
        'Please enter a valid price, such as R80.'
      );
      return;
    }

    const newItem = {
      id: editingId !== null ? editingId : Date.now().toString(),
      dishName: dishName.trim(),
      description: description.trim(),
      course: course,
      price: priceNumber.toFixed(2),
    };

    if (editingId !== null) {
      setMenuItems((items) =>
        items.map((item) =>
          item.id === editingId ? newItem : item
        )
      );

      Alert.alert('Success', 'Menu item updated.');
    } else {
      setMenuItems((items) => [...items, newItem]);

      Alert.alert('Success', 'Menu item added.');
    }

    clearForm();
  };

  const editMenuItem = (item) => {
    setDishName(item.dishName);
    setDescription(item.description);
    setCourse(item.course);
    setPrice(item.price);
    setEditingId(item.id);
  };

  const deleteMenuItem = (id) => {
    Alert.alert(
      'Delete Menu Item',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMenuItems((items) =>
              items.filter((item) => item.id !== id)
            );

            if (editingId === id) {
              clearForm();
            }
          },
        },
      ]
    );
  };

  const filteredMenuItems = menuItems.filter(
    (item) =>
      item.dishName
        .toLowerCase()
        .includes(searchText.toLowerCase()) &&
      (filterCourse === '' || item.course === filterCourse)
  );

  const averagePrice =
    menuItems.length === 0
      ? '0.00'
      : (
          menuItems.reduce(
            (total, item) => total + Number(item.price),
            0
          ) / menuItems.length
        ).toFixed(2);

  const countByCourse = (courseName) =>
    menuItems.filter((item) => item.course === courseName).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled={true}
    >
      <Text style={styles.title}>Chef Menu Manager</Text>

      <TextInput
        style={styles.input}
        placeholder="Dish Name"
        value={dishName}
        onChangeText={setDishName}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Course</Text>

      <Dropdown
        style={styles.input}
        data={courseOptions}
        labelField="label"
        valueField="value"
        placeholder="Select Course"
        value={course}
        onChange={(item) => setCourse(item.value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Price (e.g. R80)"
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={addMenuItem}
      >
        <Text style={styles.buttonText}>
          {editingId !== null ? 'Update Menu Item' : 'Add Menu Item'}
        </Text>
      </TouchableOpacity>

      {editingId !== null && (
        <TouchableOpacity
          style={styles.button}
          onPress={clearForm}
        >
          <Text style={styles.buttonText}>Cancel Edit</Text>
        </TouchableOpacity>
      )}

      <TextInput
        style={styles.input}
        placeholder="Search by dish name..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <Dropdown
        style={styles.input}
        data={[
          { label: 'All Courses', value: '' },
          ...courseOptions,
        ]}
        labelField="label"
        valueField="value"
        placeholder="Filter by course"
        value={filterCourse}
        onChange={(item) => setFilterCourse(item.value)}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setSearchText('');
          setFilterCourse('');
        }}
      >
        <Text style={styles.buttonText}>
          Clear Search and Filter
        </Text>
      </TouchableOpacity>

      <Text style={styles.menuTitle}>Menu Statistics</Text>

      <Text style={styles.menuText}>
        Total Menu Items: {menuItems.length}
      </Text>

      <Text style={styles.menuText}>
        Average Price: R{averagePrice}
      </Text>

      <Text style={styles.menuText}>
        Starters: {countByCourse('Starter')}
      </Text>

      <Text style={styles.menuText}>
        Main Courses: {countByCourse('Main Course')}
      </Text>

      <Text style={styles.menuText}>
        Desserts: {countByCourse('Dessert')}
      </Text>

      <Text style={styles.menuTitle}>Menu Items</Text>
<View style={styles.menuGrid}>
  {filteredMenuItems.length === 0 ? (
    <Text style={styles.menuText}>
      No menu items found.
    </Text>
  ) : (
    filteredMenuItems.map((item) => (
      <View
        key={item.id}
        style={[
          styles.menuCard,
          { width: gridItemWidth },
        ]}
      >
        <Text style={styles.menuTitle}>
          {item.dishName}
        </Text>

        <Text style={styles.menuText}>
          {item.description}
        </Text>

        <Text style={styles.menuText}>
          Course: {item.course}
        </Text>

        <Text style={styles.menuText}>
          Price: R{item.price}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => editMenuItem(item)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => deleteMenuItem(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    ))
  )}
</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  content: {
    padding: 1,
    paddingHorizontal: 12,
    paddingTop: 5,
    paddingBottom: 15,
    alignItems: 'stretch',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },

  label: {
    fontSize: 15,
    marginBottom: 2,
    textAlign: 'center',
  },

  input: {
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 6,
    marginBottom: 5,
    fontSize: 15,
    backgroundColor: 'white',
  },

  button: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#999',
    padding: 6,
    borderRadius: 8,
    marginBottom: 5,
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  menuTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 3,
  },

  menuText: {
    fontSize: 15,
    marginBottom: 2,
  },menuGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
},

menuCard: {
  borderWidth: 1,
  borderColor: '#999',
  borderRadius: 8,
  padding: 6,
  marginBottom: 10,
},

 menuItem: {
    marginBottom: 6,
  },
});