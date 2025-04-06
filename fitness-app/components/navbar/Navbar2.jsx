"use client";

import * as React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useRouter, usePathname } from 'next/navigation';

const NAVIGATION = [
  { kind: 'header', title: 'Main items' },
  { segment: 'workout', title: 'Workout', icon: <DashboardIcon /> },
  { segment: 'program', title: 'Programmes', icon: <ShoppingCartIcon /> },
  {segment: 'new', title: 'New', icon: <PlusCircleIcon />},
  { kind: 'divider' },
  { kind: 'header', title: 'Analytics' },
  {
    segment: 'analytics',
    title: 'Analytics',
    icon: <BarChartIcon />,
    children: [
      { segment: 'volume', title: 'Volume', icon: <DescriptionIcon /> },
      { segment: 'traffic', title: 'Traffic', icon: <DescriptionIcon /> },
    ],
  },
  { segment: 'integrations', title: 'Integrations', icon: <LayersIcon /> },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DashboardLayoutBasic({ window, children }) {
  const nextRouter = useRouter();
  const pathname = usePathname();

  // Wrap Next.js's router to provide a "navigate" function that Toolpad expects.
  const customRouter = React.useMemo(
    () => ({
      navigate: (to) => nextRouter.push(to),
      pathname,
    }),
    [nextRouter, pathname]
  );

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={customRouter}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        {/* Outer Box ensures the layout uses full viewport height and prevents overflow */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          {/* Inner Box fills remaining space and scrolls if content overflows */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              padding: 2,
              boxSizing: 'border-box',
            }}
          >
            {children}
          </Box>
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
}

DashboardLayoutBasic.propTypes = {
  window: PropTypes.func,
  children: PropTypes.node,
};

export default DashboardLayoutBasic;
