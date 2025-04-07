"use client"

import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

export default function AnalyticsBarChart({ chartData }) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 300 });

  // Update dimensions when container size changes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Assume chartData is in the format: { "Chest": [0,0,0,0], "Back": [1,2,3,4], ... }
  const muscleGroups = Object.keys(chartData);
  const weeksCount = chartData[muscleGroups[0]].length;
  const weeks = Array.from({ length: weeksCount }, (_, i) => `Week ${i + 1}`);

  // Transform the data so that each object represents a week
  const dataset = weeks.map((weekLabel, index) => {
    const weekData = { week: weekLabel };
    muscleGroups.forEach((muscle) => {
      weekData[muscle] = chartData[muscle][index];
    });
    return weekData;
  });

  const series = muscleGroups.map((muscle) => ({
    dataKey: muscle,
    label: muscle,
  }));

  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: '100%', minHeight: 300 }}
    >
      <BarChart
        dataset={dataset}
        xAxis={[{ scaleType: 'band', dataKey: 'week' }]}
        series={series}
        yAxis={[{ label: 'Set Volume' }]}
        width={dimensions.width}
        height={dimensions.height}
        sx={{
          [`.${axisClasses.left} .${axisClasses.label}`]: {
          },
        }}
      />
    </div>
  );
}
