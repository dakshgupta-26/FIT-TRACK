import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api-client';

export interface HealthMetric {
  _id: string;
  uid: string;
  type: string;
  value: number;
  unit: string;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthMetricsSummary {
  _id: string;
  latestValue: number;
  latestUnit: string;
  latestDate: string;
}

export const useHealthMetrics = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [summary, setSummary] = useState<HealthMetricsSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const fetchMetrics = useCallback(async (type?: string, limit = 100) => {
    if (!currentUser?.uid) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ limit: limit.toString() });
      if (type) params.append('type', type);
      
      const { data: result } = await apiClient.get(`/health-metrics/${currentUser.uid}?${params}`);

      if (result.success) {
        setMetrics(result.metrics);
      } else {
        throw new Error(result.error || 'Failed to fetch metrics');
      }
    } catch (err) {
      console.error('Error fetching health metrics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid]);

  const fetchSummary = useCallback(async () => {
    if (!currentUser?.uid) return;

    try {
      const { data: result } = await apiClient.get(`/health-metrics/${currentUser.uid}/summary`);

      if (result.success) {
        setSummary(result.summary);
      } else {
        throw new Error(result.error || 'Failed to fetch summary');
      }
    } catch (err) {
      console.error('Error fetching health metrics summary:', err);
    }
  }, [currentUser?.uid]);

  const addMetric = async (type: string, value: number, unit: string, date: string, notes?: string) => {
    if (!currentUser?.uid) throw new Error('User not authenticated');

    const { data: result } = await apiClient.post('/health-metrics', {
      uid: currentUser.uid,
      type,
      value,
      unit,
      date,
      notes
    });

    if (result.success) {
      // Refresh metrics and summary
      await Promise.all([fetchMetrics(), fetchSummary()]);
      return result.healthMetric;
    } else {
      throw new Error(result.error || 'Failed to add metric');
    }
  };

  const updateMetric = async (id: string, value: number, unit: string, date: string, notes?: string) => {
    const { data: result } = await apiClient.put(`/health-metrics/${id}`, {
      value,
      unit,
      date,
      notes
    });

    if (result.success) {
      // Refresh metrics and summary
      await Promise.all([fetchMetrics(), fetchSummary()]);
      return result.healthMetric;
    } else {
      throw new Error(result.error || 'Failed to update metric');
    }
  };

  const deleteMetric = async (id: string) => {
    const { data: result } = await apiClient.delete(`/health-metrics/${id}`);

    if (result.success) {
      // Refresh metrics and summary
      await Promise.all([fetchMetrics(), fetchSummary()]);
      return true;
    } else {
      throw new Error(result.error || 'Failed to delete metric');
    }
  };

  // Get metrics by type
  const getMetricsByType = (type: string) => {
    return metrics.filter(metric => metric.type === type);
  };

  // Get latest metric by type
  const getLatestMetric = (type: string) => {
    return metrics.find(metric => metric.type === type);
  };

  // Get summary by type
  const getSummaryByType = (type: string) => {
    return summary.find(item => item._id === type);
  };

  useEffect(() => {
    if (currentUser?.uid) {
      fetchMetrics();
      fetchSummary();
    }
  }, [currentUser?.uid, fetchMetrics, fetchSummary]);

  return {
    metrics,
    summary,
    loading,
    error,
    fetchMetrics,
    fetchSummary,
    addMetric,
    updateMetric,
    deleteMetric,
    getMetricsByType,
    getLatestMetric,
    getSummaryByType
  };
};
