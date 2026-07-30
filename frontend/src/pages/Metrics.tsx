
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Heart, Activity, Clock, Weight } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import AddMeasurementModal from '@/components/modals/AddMeasurementModal';
import { useHealthMetrics } from '@/hooks/useHealthMetrics';

// Fallback sample data for when no real data is available
const fallbackWeightData = [
  { date: 'Mar 5', value: 76.2 },
  { date: 'Mar 12', value: 75.8 },
  { date: 'Mar 19', value: 75.1 },
  { date: 'Mar 26', value: 74.9 },
  { date: 'Apr 2', value: 74.5 },
  { date: 'Apr 9', value: 74.2 },
  { date: 'Apr 16', value: 73.8 },
];

const fallbackHeartRateData = [
  { date: '04/01', resting: 68, active: 132 },
  { date: '04/02', resting: 67, active: 145 },
  { date: '04/03', resting: 69, active: 139 },
  { date: '04/04', resting: 70, active: 128 },
  { date: '04/05', resting: 66, active: 142 },
  { date: '04/06', resting: 67, active: 138 },
  { date: '04/07', resting: 65, active: 140 },
];

const fallbackSleepData = [
  { date: '04/01', hours: 7.2, deep: 2.1, light: 4.0, rem: 1.1 },
  { date: '04/02', hours: 7.5, deep: 2.3, light: 3.9, rem: 1.3 },
  { date: '04/03', hours: 6.8, deep: 1.9, light: 3.8, rem: 1.1 },
  { date: '04/04', hours: 7.8, deep: 2.5, light: 4.1, rem: 1.2 },
  { date: '04/05', hours: 7.1, deep: 2.0, light: 3.9, rem: 1.2 },
  { date: '04/06', hours: 6.9, deep: 1.8, light: 4.0, rem: 1.1 },
  { date: '04/07', hours: 7.6, deep: 2.4, light: 4.0, rem: 1.2 },
];

const fallbackBloodPressureData = [
  { date: '04/01', systolic: 122, diastolic: 78 },
  { date: '04/02', systolic: 120, diastolic: 76 },
  { date: '04/03', systolic: 124, diastolic: 79 },
  { date: '04/04', systolic: 118, diastolic: 75 },
  { date: '04/05', systolic: 121, diastolic: 77 },
  { date: '04/06', systolic: 120, diastolic: 76 },
  { date: '04/07', systolic: 119, diastolic: 74 },
];

const Metrics = () => {
  const { toast } = useToast();
  const { 
    metrics, 
    summary, 
    loading, 
    getMetricsByType, 
    getLatestMetric, 
    getSummaryByType,
    fetchMetrics,
    fetchSummary 
  } = useHealthMetrics();

  // Transform real data for charts with fallback
  const weightData = getMetricsByType('weight').length > 0 
    ? getMetricsByType('weight').map(metric => ({
        date: new Date(metric.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: metric.value
      })).reverse()
    : fallbackWeightData;

  const heartRateData = getMetricsByType('heart_rate_resting').length > 0
    ? getMetricsByType('heart_rate_resting').map(metric => ({
        date: new Date(metric.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
        resting: metric.value,
        active: getMetricsByType('heart_rate_active').find(m => 
          new Date(m.date).toDateString() === new Date(metric.date).toDateString()
        )?.value || 0
      })).reverse()
    : fallbackHeartRateData;

  const sleepData = getMetricsByType('sleep_hours').length > 0
    ? getMetricsByType('sleep_hours').map(metric => ({
        date: new Date(metric.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
        hours: metric.value,
        deep: getMetricsByType('sleep_deep').find(m => 
          new Date(m.date).toDateString() === new Date(metric.date).toDateString()
        )?.value || 0,
        light: getMetricsByType('sleep_light').find(m => 
          new Date(m.date).toDateString() === new Date(metric.date).toDateString()
        )?.value || 0,
        rem: getMetricsByType('sleep_rem').find(m => 
          new Date(m.date).toDateString() === new Date(metric.date).toDateString()
        )?.value || 0
      })).reverse()
    : fallbackSleepData;

  const bloodPressureData = getMetricsByType('blood_pressure_systolic').length > 0
    ? getMetricsByType('blood_pressure_systolic').map(metric => ({
        date: new Date(metric.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
        systolic: metric.value,
        diastolic: getMetricsByType('blood_pressure_diastolic').find(m => 
          new Date(m.date).toDateString() === new Date(metric.date).toDateString()
        )?.value || 0
      })).reverse()
    : fallbackBloodPressureData;

  // Create recent measurements from real data
  const recentMeasurements = [
    { 
      name: 'Weight', 
      value: getLatestMetric('weight') ? `${getLatestMetric('weight')?.value} ${getLatestMetric('weight')?.unit}` : 'No data', 
      date: getLatestMetric('weight') ? new Date(getLatestMetric('weight')?.date || '').toLocaleDateString() : 'No data', 
      icon: Weight 
    },
    { 
      name: 'BMI', 
      value: getLatestMetric('bmi') ? getLatestMetric('bmi')?.value.toString() : 'No data', 
      date: getLatestMetric('bmi') ? new Date(getLatestMetric('bmi')?.date || '').toLocaleDateString() : 'No data', 
      icon: Activity 
    },
    { 
      name: 'Body Fat', 
      value: getLatestMetric('body_fat') ? `${getLatestMetric('body_fat')?.value}${getLatestMetric('body_fat')?.unit}` : 'No data', 
      date: getLatestMetric('body_fat') ? new Date(getLatestMetric('body_fat')?.date || '').toLocaleDateString() : 'No data', 
      icon: Weight 
    },
    { 
      name: 'Resting Heart Rate', 
      value: getLatestMetric('heart_rate_resting') ? `${getLatestMetric('heart_rate_resting')?.value} ${getLatestMetric('heart_rate_resting')?.unit}` : 'No data', 
      date: getLatestMetric('heart_rate_resting') ? new Date(getLatestMetric('heart_rate_resting')?.date || '').toLocaleDateString() : 'No data', 
      icon: Heart 
    },
    { 
      name: 'Blood Pressure', 
      value: getLatestMetric('blood_pressure_systolic') && getLatestMetric('blood_pressure_diastolic') 
        ? `${getLatestMetric('blood_pressure_systolic')?.value}/${getLatestMetric('blood_pressure_diastolic')?.value}` 
        : 'No data', 
      date: getLatestMetric('blood_pressure_systolic') ? new Date(getLatestMetric('blood_pressure_systolic')?.date || '').toLocaleDateString() : 'No data', 
      icon: Activity 
    },
    { 
      name: 'Avg. Sleep', 
      value: getLatestMetric('sleep_hours') ? `${getLatestMetric('sleep_hours')?.value} hrs` : 'No data', 
      date: getLatestMetric('sleep_hours') ? new Date(getLatestMetric('sleep_hours')?.date || '').toLocaleDateString() : 'No data', 
      icon: Clock 
    },
  ];

  const handleMeasurementAdded = () => {
    fetchMetrics();
    fetchSummary();
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Health Metrics</h1>
          <p className="text-muted-foreground">Track and monitor your health indicators</p>
        </div>
        <AddMeasurementModal onMeasurementAdded={handleMeasurementAdded} />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {recentMeasurements.map((measurement, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-2 pt-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-muted-foreground">{measurement.name}</CardTitle>
                <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                  <measurement.icon className="h-3.5 w-3.5" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-bold">{measurement.value}</div>
                <p className="text-xs text-muted-foreground">{measurement.date}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Tabs defaultValue="weight">
        <TabsList className="mb-6">
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="heart-rate">Heart Rate</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="blood-pressure">Blood Pressure</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weight" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Weight Tracking</CardTitle>
                  <CardDescription>Your progress over time</CardDescription>
                </div>
                <div className="flex gap-2 text-sm">
                  <Button variant="outline" size="sm">1M</Button>
                  <Button variant="outline" size="sm" className="bg-primary/5">3M</Button>
                  <Button variant="outline" size="sm">6M</Button>
                  <Button variant="outline" size="sm">1Y</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weightData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      domain={['dataMin - 1', 'dataMax + 1']}
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      label={{ 
                        value: 'kg', 
                        angle: -90, 
                        position: 'insideLeft', 
                        style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } 
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                        color: 'hsl(var(--card-foreground))'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1}
                      fill="url(#colorWeight)"
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                      dot={{ r: 3, strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Starting</p>
                  <p className="text-lg font-bold">
                    {getMetricsByType('weight').length > 0 
                      ? `${getMetricsByType('weight')[getMetricsByType('weight').length - 1]?.value} ${getMetricsByType('weight')[getMetricsByType('weight').length - 1]?.unit}`
                      : '76.2 kg'
                    }
                  </p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Current</p>
                  <p className="text-lg font-bold">
                    {getLatestMetric('weight') 
                      ? `${getLatestMetric('weight')?.value} ${getLatestMetric('weight')?.unit}`
                      : '73.8 kg'
                    }
                  </p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Change</p>
                  <p className="text-lg font-bold text-green-500">
                    {getMetricsByType('weight').length > 1 
                      ? `${(getLatestMetric('weight')?.value || 0) - (getMetricsByType('weight')[getMetricsByType('weight').length - 1]?.value || 0)} kg`
                      : '-2.4 kg'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="heart-rate" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Heart Rate</CardTitle>
                  <CardDescription>Resting and active heart rate</CardDescription>
                </div>
                <div className="flex gap-2 text-sm">
                  <Button variant="outline" size="sm">1W</Button>
                  <Button variant="outline" size="sm" className="bg-primary/5">1M</Button>
                  <Button variant="outline" size="sm">3M</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={heartRateData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      label={{ 
                        value: 'bpm', 
                        angle: -90, 
                        position: 'insideLeft', 
                        style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } 
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                        color: 'hsl(var(--card-foreground))'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      name="Resting"
                      dataKey="resting" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                      dot={{ r: 3, fill: 'hsl(var(--background))', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      name="Active"
                      dataKey="active" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                      dot={{ r: 3, fill: 'hsl(var(--background))', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Avg. Resting</p>
                  <div className="flex items-center justify-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <p className="text-lg font-bold">
                      {getLatestMetric('heart_rate_resting') 
                        ? `${getLatestMetric('heart_rate_resting')?.value} bpm`
                        : '67 bpm'
                      }
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Avg. Active</p>
                  <div className="flex items-center justify-center gap-2">
                    <Activity className="h-5 w-5 text-accent" />
                    <p className="text-lg font-bold">
                      {getLatestMetric('heart_rate_active') 
                        ? `${getLatestMetric('heart_rate_active')?.value} bpm`
                        : '138 bpm'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sleep" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Sleep Tracking</CardTitle>
                  <CardDescription>Your sleep duration and quality</CardDescription>
                </div>
                <div className="flex gap-2 text-sm">
                  <Button variant="outline" size="sm">1W</Button>
                  <Button variant="outline" size="sm" className="bg-primary/5">2W</Button>
                  <Button variant="outline" size="sm">1M</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sleepData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorDeep" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorLight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#93c5fd" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRem" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      label={{ 
                        value: 'hours', 
                        angle: -90, 
                        position: 'insideLeft', 
                        style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } 
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                        color: 'hsl(var(--card-foreground))'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      name="Total Sleep"
                      dataKey="hours" 
                      stroke="hsl(var(--primary))" 
                      fill="none"
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                      dot={{ r: 3, strokeWidth: 2 }}
                    />
                    <Area 
                      type="monotone"
                      name="Deep Sleep" 
                      dataKey="deep" 
                      stackId="1"
                      stroke="#3b82f6" 
                      fill="url(#colorDeep)"
                    />
                    <Area 
                      type="monotone" 
                      name="Light Sleep"
                      dataKey="light" 
                      stackId="1"
                      stroke="#93c5fd" 
                      fill="url(#colorLight)"
                    />
                    <Area 
                      type="monotone" 
                      name="REM Sleep"
                      dataKey="rem" 
                      stackId="1"
                      stroke="#818cf8" 
                      fill="url(#colorRem)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Avg. Total</p>
                  <p className="text-lg font-bold">
                    {getLatestMetric('sleep_hours') 
                      ? `${getLatestMetric('sleep_hours')?.value} hrs`
                      : '7.3 hrs'
                    }
                  </p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Deep</p>
                  <p className="text-lg font-bold text-blue-500">
                    {getLatestMetric('sleep_deep') 
                      ? `${getLatestMetric('sleep_deep')?.value} hrs`
                      : '2.1 hrs'
                    }
                  </p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Light</p>
                  <p className="text-lg font-bold text-blue-300">
                    {getLatestMetric('sleep_light') 
                      ? `${getLatestMetric('sleep_light')?.value} hrs`
                      : '4.0 hrs'
                    }
                  </p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">REM</p>
                  <p className="text-lg font-bold text-indigo-400">
                    {getLatestMetric('sleep_rem') 
                      ? `${getLatestMetric('sleep_rem')?.value} hrs`
                      : '1.2 hrs'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="blood-pressure" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Blood Pressure</CardTitle>
                  <CardDescription>Systolic and diastolic measurements</CardDescription>
                </div>
                <div className="flex gap-2 text-sm">
                  <Button variant="outline" size="sm">1W</Button>
                  <Button variant="outline" size="sm" className="bg-primary/5">2W</Button>
                  <Button variant="outline" size="sm">1M</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bloodPressureData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      label={{ 
                        value: 'mmHg', 
                        angle: -90, 
                        position: 'insideLeft', 
                        style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } 
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                        color: 'hsl(var(--card-foreground))'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      name="Systolic"
                      dataKey="systolic" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                      dot={{ r: 3, fill: 'hsl(var(--background))', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      name="Diastolic"
                      dataKey="diastolic" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                      dot={{ r: 3, fill: 'hsl(var(--background))', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Avg. Systolic</p>
                  <p className="text-lg font-bold text-accent">
                    {getLatestMetric('blood_pressure_systolic') 
                      ? `${getLatestMetric('blood_pressure_systolic')?.value} mmHg`
                      : '120.6 mmHg'
                    }
                  </p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Avg. Diastolic</p>
                  <p className="text-lg font-bold text-primary">
                    {getLatestMetric('blood_pressure_diastolic') 
                      ? `${getLatestMetric('blood_pressure_diastolic')?.value} mmHg`
                      : '76.4 mmHg'
                    }
                  </p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-lg font-bold text-green-500">Healthy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Metrics;
