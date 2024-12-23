import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function ContactUsPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = { name: '', email: '', phone: '', subject: '', message: '' };

        // Validate Name
        if (!name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        // Validate Email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Invalid email format';
            isValid = false;
        }

        // Validate Phone Number (Basic Format Validation for 10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phone.trim()) {
            newErrors.phone = 'Phone number is required';
            isValid = false;
        } else if (!phoneRegex.test(phone)) {
            newErrors.phone = 'Invalid phone number format. Must be 10 digits.';
            isValid = false;
        }

        // Validate Subject
        if (!subject.trim()) {
            newErrors.subject = 'Subject is required';
            isValid = false;
        }

        // Validate Message
        if (!message.trim()) {
            newErrors.message = 'Message is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            // Web environment: use window.alert
            if (typeof window !== 'undefined') {
                window.alert('Message sent');
            } else {
                // Mobile environment: use React Native Alert
                Alert.alert('Message sent');
            }

            // Clear the form
            setName('');
            setEmail('');
            setPhone('');
            setSubject('');
            setMessage('');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Contact Us</Text>

            <TextInput
                style={[styles.input, errors.name && styles.errorInput]}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <TextInput
                style={[styles.input, errors.email && styles.errorInput]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
                style={[styles.input, errors.phone && styles.errorInput]}
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

            <TextInput
                style={[styles.input, errors.subject && styles.errorInput]}
                placeholder="Subject"
                value={subject}
                onChangeText={setSubject}
            />
            {errors.subject && <Text style={styles.errorText}>{errors.subject}</Text>}

            {/* Adjusted Message Input */}
            <TextInput
                style={[styles.messageInput, errors.message && styles.errorInput]} // New style for Message Input
                placeholder="Message"
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={6} // Make it taller with more initial lines
            />
            {errors.message && <Text style={styles.errorText}>{errors.message}</Text>}

            <Button title="Send Message" onPress={handleSubmit} color={Colors.light.primary} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.light.primary,
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 12,
        fontSize: 16,
    },
    messageInput: {
        height: 150,  
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 12,
        fontSize: 16,
        textAlignVertical: 'top',
    },
    errorInput: {
        borderColor: '#f00', 
    },
    errorText: {
        color: '#f00', 
        fontSize: 12,
        marginBottom: 10,
    },
});
