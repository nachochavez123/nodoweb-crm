import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export default function SearchBar({ value, onChangeText, placeholder }) {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.icon}>🔍</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
        />
        {value && (
          <TouchableOpacity style={styles.clearButton}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = {
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f1f5f9',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
    color: '#94a3b8',
  },
  input: {
    flex: 1,
    color: '#0f172a',
    fontSize: 14,
    paddingVertical: 10,
  },
  clearButton: {
    paddingHorizontal: 8,
  },
  clearText: {
    color: '#94a3b8',
    fontSize: 16,
  },
};
