import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const GoogleMapComponent = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Our Location</Text>
            <Text style={styles.description}>
                We are located in the heart of Berlin. Visit us at our office to discuss your business needs or enjoy the vibrant atmosphere of this amazing city.
            </Text>

            {/* Google Map iframe */}
            <div className="embed-responsive" style={{ height: 500 }}>
                <iframe
                    className="embed-responsive-item"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d237144.0191677027!2d13.288437!3d52.517036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851e8a2e6b1b1%3A0x4e9b8e9e1e5e6b1!2sBerlin!5e0!3m2!1sen!2sde!4v1611817264351!5m2!1sen!2sde"
                    allowFullScreen
                    style={{ width: '100%', height: '100%' }}
                ></iframe>
            </div>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#555',
        marginBottom: 20,
    },
    testimonialsHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    socialMediaHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    }
});

export default GoogleMapComponent;
