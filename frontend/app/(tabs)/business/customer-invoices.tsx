import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Colors } from '@/constants/Colors';

interface Customer {
    id: number;
    name: string;
    email: string;
    registrationDate: string;
    phoneNumber: string;
    addressId: number;
}

interface Address {
    id: number;
    street: string;
    city: string;
    postalCode: string;
    country: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    categoryId: number;
    supplierId: number;
}

interface InvoiceItem {
    id: number;
    quantity: number;
    price: number;
    productId: number;
    invoiceId: number;
}

interface Invoice {
    id: number;
    date: string;
    totalAmount: number;
    customerId: number;
}

interface JoinedInvoice {
    id: number;
    date: string;
    totalAmount: number;
    customer: Customer | null;
    address: Address | null;
    items: (InvoiceItem & { product: Product | null })[];
}

export default function CustomerInvoiceSummary() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [expandedInvoiceId, setExpandedInvoiceId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [invoicesRes, customersRes, invoiceItemsRes, productsRes, addressesRes] = await Promise.all([
                    axios.get<Invoice[]>('http://localhost:5094/invoices'),
                    axios.get<Customer[]>('http://localhost:5094/customers'),
                    axios.get<InvoiceItem[]>('http://localhost:5094/invoiceitems'),
                    axios.get<Product[]>('http://localhost:5094/products'),
                    axios.get<Address[]>('http://localhost:5094/address'),
                ]);
                setInvoices(invoicesRes.data);
                setCustomers(customersRes.data);
                setInvoiceItems(invoiceItemsRes.data);
                setProducts(productsRes.data);
                setAddresses(addressesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const getJoinedData = (): JoinedInvoice[] => {
        return invoices.map(invoice => {
            const customer = customers.find(c => c.id === invoice.customerId) || null;
            const address = customer ? addresses.find(a => a.id === customer.addressId) || null : null;
            const items = invoiceItems
                .filter(item => item.invoiceId === invoice.id)
                .map(item => ({
                    ...item,
                    product: products.find(p => p.id === item.productId) || null,
                }));

            return {
                ...invoice,
                customer,
                address,
                items,
            };
        });
    };

    const toggleExpand = (invoiceId: number) => {
        setExpandedInvoiceId(prev => (prev === invoiceId ? null : invoiceId));
    };

    const joinedData = getJoinedData();

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Customer Invoice Summary</Text>
            {joinedData.map(invoice => (
                <View key={invoice.id} style={styles.card}>
                    <TouchableOpacity onPress={() => toggleExpand(invoice.id)} style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Invoice #{invoice.id}</Text>
                    </TouchableOpacity>

                    {expandedInvoiceId === invoice.id && (
                        <View style={styles.cardContent}>
                            <Text style={styles.cardDate}>Date: {new Date(invoice.date).toLocaleDateString()}</Text>
                            <Text style={styles.cardCustomer}>Customer: {invoice.customer?.name || 'N/A'}</Text>
                            <Text style={styles.cardAddress}>
                                Address: {invoice.address
                                    ? `${invoice.address.street}, ${invoice.address.city}, ${invoice.address.country}`
                                    : 'N/A'}
                            </Text>
                            <View style={styles.itemsContainer}>
                                <Text style={styles.cardItemsHeader}>Purchased Items:</Text>
                                {invoice.items.map(item => (
                                    <View key={item.id} style={styles.itemRow}>
                                        <Text style={styles.itemName}>{item.product?.name || 'Unknown Product'}</Text>
                                        <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                                        <Text style={styles.itemPrice}>Price: ${item.price.toFixed(2)}</Text>
                                    </View>
                                ))}
                            </View>
                            <Text style={styles.cardTotal}>Total Amount: ${invoice.totalAmount.toFixed(2)}</Text>
                        </View>
                    )}
                </View>
            ))}
        </ScrollView>
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
        marginTop: 12,
    },
    cardDate: {
        fontSize: 14,
        color: '#888',
        marginBottom: 4,
    },
    cardCustomer: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardAddress: {
        fontSize: 14,
        color: '#888',
        marginBottom: 8,
    },
    itemsContainer: {
        marginTop: 8,
    },
    cardItemsHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    itemName: {
        fontSize: 14,
        flex: 2,
    },
    itemQuantity: {
        fontSize: 14,
        flex: 1,
        textAlign: 'center',
    },
    itemPrice: {
        fontSize: 14,
        flex: 1,
        textAlign: 'right',
    },
    cardTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
    },
});
