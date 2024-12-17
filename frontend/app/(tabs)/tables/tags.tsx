import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import axios from 'axios';

interface Tag {
    id?: number;
    name: string;
}

export default function TagsScreen() {
    const [tagsData, setTagsData] = useState<Tag[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [editTag, setEditTag] = useState<Tag | null>(null);
    const [newTag, setNewTag] = useState<Tag>({
        name: '',
    });

    // Fetch tags from the backend
    const fetchTags = async () => {
        try {
            const response = await axios.get('http://localhost:5094/tags');
            setTagsData(response.data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const handlePress = (tagId: string) => {
        setExpanded((prev) => (prev === tagId ? null : tagId));
    };

    // Handle Edit Tag
    const handleEditTag = (tag: Tag) => {
        setEditTag(tag);
        setIsModalVisible(true);
    };

    // Handle Update Tag
    const handleUpdateTag = async () => {
        if (editTag) {
            try {
                const response = await axios.put(
                    `http://localhost:5094/tags/${editTag.id}`,
                    editTag
                );
                if (response.status === 200) {
                    const updatedTags = tagsData.map((t) =>
                        t.id === editTag.id ? editTag : t
                    );
                    setTagsData(updatedTags);
                    setIsModalVisible(false);
                    setEditTag(null);
                    Alert.alert('Success', 'Tag updated successfully');
                } else {
                    Alert.alert('Error', 'Failed to update the tag');
                }
            } catch (error) {
                console.error('Error updating tag:', error);
                Alert.alert('Error', 'Failed to update the tag');
            }
        }
    };

    // Handle Add Tag
    const handleAddTag = async () => {
        if (!newTag.name) {
            Alert.alert('Missing Fields', 'Please fill in all fields before adding a tag.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5094/tags', newTag);
            setTagsData((prev) => [...prev, response.data]);
            setIsAddModalVisible(false);
            setNewTag({
                name: '',
            });
        } catch (error) {
            console.error('Error adding tag:', error);
            Alert.alert('Error', 'Failed to add the tag');
        }
    };

    // Handle Delete Tag
    const handleDeleteTag = (tagId: number) => {
        // Check if the app is running on web, and use window.confirm on the web.
        if (typeof window !== 'undefined') {
            // Web environment
            const confirmation = window.confirm('Are you sure you want to delete this tag?');
            if (confirmation) {
                deleteTagFromBackend(tagId);
            } else {
                console.log('Delete cancelled');
            }
        } else {
            // For mobile platforms (iOS/Android), use the React Native Alert
            Alert.alert('Delete Tag', 'Are you sure you want to delete this tag?', [
                {
                    text: 'Cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => deleteTagFromBackend(tagId),
                    style: 'destructive',
                },
            ]);
        }
    };

    // Function to delete tag from the backend and update UI
    const deleteTagFromBackend = async (tagId: number) => {
        try {
            // Optimistic UI update: Remove the tag immediately from the local state
            setTagsData((prev) =>
                prev.filter((tag) => tag.id !== tagId)
            );

            const response = await axios.delete(`http://localhost:5094/tags/${tagId}`);
            if (response.status === 200) {
                fetchTags();
                Alert.alert('Success', 'Tag deleted successfully');
            } else {
                fetchTags();
                Alert.alert('Error', 'Failed to delete the tag');
            }
        } catch (error) {
            console.error('Error deleting tag:', error);
            fetchTags();
            Alert.alert('Error', 'Failed to delete the tag');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Tags</Text>

            <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
                <Text style={styles.addButtonText}>Add New Tag</Text>
            </TouchableOpacity>

            {tagsData.map((tag) => (
                <View key={tag.id} style={styles.card}>
                    <TouchableOpacity
                        onPress={() => handlePress(tag.id?.toString() || '')}
                        style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Tag Name: {tag.name}</Text>
                    </TouchableOpacity>

                    {expanded === tag.id?.toString() && (
                        <View style={styles.cardContent}>
                            <Text style={styles.cardLabel}>Tag Name:</Text>
                            <Text style={styles.cardValue}>{tag.name}</Text>

                            <View style={styles.cardActions}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => handleEditTag(tag)}>
                                    <Text style={styles.buttonText}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.deleteButton]}
                                    onPress={() => handleDeleteTag(tag.id!)}>
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            ))}

            {/* Modal for editing a tag */}
            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Edit Tag</Text>

                        {/* Tag Name Field */}
                        <Text style={styles.label}>Tag Name</Text>
                        <TextInput
                            style={styles.input}
                            value={editTag?.name || ''}
                            onChangeText={(text) =>
                                setEditTag((prev) => ({ ...prev!, name: text }))
                            }
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.updateButton]}
                                onPress={handleUpdateTag}>
                                <Text style={styles.actionButtonText}>Update</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.cancelButton]}
                                onPress={() => setIsModalVisible(false)}>
                                <Text style={styles.actionButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal for adding a new tag */}
            <Modal visible={isAddModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Add New Tag</Text>

                        {/* Tag Name Field */}
                        <Text style={styles.label}>Tag Name</Text>
                        <TextInput
                            style={styles.input}
                            value={newTag.name}
                            onChangeText={(text) =>
                                setNewTag((prev) => ({ ...prev, name: text }))
                            }
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.updateButton]}
                                onPress={handleAddTag}>
                                <Text style={styles.actionButtonText}>Add</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.cancelButton]}
                                onPress={() => setIsAddModalVisible(false)}>
                                <Text style={styles.actionButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: Colors.light.background,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    addButton: {
        backgroundColor: Colors.light.primary,
        paddingVertical: 10,
        borderRadius: 4,
        marginBottom: 16,
    },
    addButtonText: {
        color: Colors.light.background,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardContent: {
        marginTop: 8,
    },
    cardLabel: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    cardValue: {
        fontSize: 14,
        marginBottom: 8,
    },
    button: {
        backgroundColor: Colors.light.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
    },
    deleteButton: {
        backgroundColor: Colors.light.danger,
    },
    buttonText: {
        color: Colors.light.background,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    updateButton: {
        backgroundColor: Colors.light.primary,
    },
    cancelButton: {
        backgroundColor: '#ccc',
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
});

