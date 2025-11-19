import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import apiClient from '../config/api';

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{formatCurrency(value)}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007F5F" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#007F5F']} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#007F5F" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          title={t('dashboard.totalSales')}
          value={stats?.totalSales || 0}
          icon="trending-up"
          color="#007F5F"
        />
        <StatCard
          title={t('dashboard.totalExpenses')}
          value={stats?.totalExpenses || 0}
          icon="trending-down"
          color="#dc2626"
        />
        <StatCard
          title={t('dashboard.netProfit')}
          value={(stats?.totalSales || 0) - (stats?.totalExpenses || 0)}
          icon="cash"
          color={(stats?.totalSales || 0) - (stats?.totalExpenses || 0) >= 0 ? '#007F5F' : '#dc2626'}
        />
        <StatCard
          title={t('dashboard.inventoryItems')}
          value={stats?.inventoryCount || 0}
          icon="cube"
          color="#F4C542"
        />
      </View>

      <View style={styles.languageSelector}>
        <Text style={styles.sectionTitle}>Language</Text>
        <View style={styles.languageButtons}>
          {['en', 'ha', 'yo', 'ig'].map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[
                styles.languageButton,
                i18n.language === lang && styles.languageButtonActive,
              ]}
              onPress={() => i18n.changeLanguage(lang)}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  i18n.language === lang && styles.languageButtonTextActive,
                ]}
              >
                {lang.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007F5F',
  },
  logoutButton: {
    padding: 10,
  },
  statsContainer: {
    padding: 15,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  languageSelector: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  languageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  languageButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  languageButtonActive: {
    backgroundColor: '#007F5F',
  },
  languageButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  languageButtonTextActive: {
    color: '#fff',
  },
});
