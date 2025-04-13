import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

function Teste() {
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Editar Usuário</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Adicionar Usuário</Text>
                </TouchableOpacity>

                {/* Password Input */}
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        secureTextEntry={!isPasswordVisible}
                        placeholder="Digite sua senha"
                        placeholderTextColor="#C1C1C1"
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.toggleButton}>
                        <Text style={styles.toggleButtonText}>
                            {isPasswordVisible ? 'Ocultar' : 'Mostrar'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#333333', // Updated background color
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        marginVertical: 10,
    },
    buttonText: {
        color: '#C1C1C1', // Updated text color
        fontSize: 16,
        fontWeight: 'bold',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#333333',
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    passwordInput: {
        flex: 1,
        height: 50,
        color: '#333333',
    },
    toggleButton: {
        marginLeft: 10,
    },
    toggleButtonText: {
        color: '#C1C1C1',
        fontSize: 14,
    },
});

export default Teste;