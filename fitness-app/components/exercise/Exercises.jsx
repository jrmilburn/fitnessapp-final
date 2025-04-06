"use client";

import * as React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import {
  Create,
  CrudProvider,
  DataSourceCache,
  Edit,
  List,
  Show,
} from '@toolpad/core/Crud';
import { useDemoRouter } from '@toolpad/core/internal';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const NAVIGATION = [
  {
    segment: 'exercises',
    title: 'Exercises',
    icon: <FitnessCenterIcon />,
    pattern: 'exercises{/:exerciseId}*',
  },
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

// Helper for matching URL patterns.
function matchPath(pattern, pathname) {
  const regex = new RegExp(`^${pattern.replace(/:[^/]+/g, '([^/]+)')}$`);
  const match = pathname.match(regex);
  return match ? match[1] : null;
}

function CrudAdvanced(props) {
  const { window } = props;
  const rootPath = '/exercises';
  const router = useDemoRouter(rootPath);
  const nextRouter = useRouter();

  // Define route paths.
  const listPath = rootPath;
  const createPath = `/new`;
  const showPath = `${rootPath}/:exerciseId`;
  const editPath = `${rootPath}/:exerciseId/edit`;

  // Fetch exercises from API and store in state.
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    fetch('/api/exercise')
      .then(response => response.json())
      .then(data => {
        if (!data || data.length === 0) {
          nextRouter.push(createPath);
          return;
        }
        setExercises(data);
      })
      .catch((error) => {
        console.error("Error fetching exercises:", error);
      });
  }, [router, createPath]);

  // Create a data source that uses the current exercises state.
  const exercisesDataSource = useMemo(() => ({
    fields: [
      { field: 'id', headerName: 'ID' },
      { field: 'name', headerName: 'Exercise Name', flex: 1 },
      { field: 'muscle', headerName: 'Muscle Group', flex: 1 },
    ],
    getMany: ({ paginationModel, filterModel, sortModel }) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          let processedExercises = [...exercises];

          // Apply filters (demo only)
          if (filterModel?.items?.length) {
            filterModel.items.forEach(({ field, value, operator }) => {
              if (!field || value == null) return;
              processedExercises = processedExercises.filter((exercise) => {
                const exerciseValue = exercise[field];
                switch (operator) {
                  case 'contains':
                    return String(exerciseValue)
                      .toLowerCase()
                      .includes(String(value).toLowerCase());
                  case 'equals':
                    return exerciseValue === value;
                  case 'startsWith':
                    return String(exerciseValue)
                      .toLowerCase()
                      .startsWith(String(value).toLowerCase());
                  case 'endsWith':
                    return String(exerciseValue)
                      .toLowerCase()
                      .endsWith(String(value).toLowerCase());
                  case '>':
                    return exerciseValue > value;
                  case '<':
                    return exerciseValue < value;
                  default:
                    return true;
                }
              });
            });
          }

          // Apply sorting
          if (sortModel?.length) {
            processedExercises.sort((a, b) => {
              for (const { field, sort } of sortModel) {
                if (a[field] < b[field]) return sort === 'asc' ? -1 : 1;
                if (a[field] > b[field]) return sort === 'asc' ? 1 : -1;
              }
              return 0;
            });
          }

          // Apply pagination
          const start = paginationModel.page * paginationModel.pageSize;
          const end = start + paginationModel.pageSize;
          const paginatedExercises = processedExercises.slice(start, end);

          resolve({
            items: paginatedExercises,
            itemCount: processedExercises.length,
          });
        }, 750);
      });
    },
    getOne: (exerciseId) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const exerciseToShow = exercises.find(
            (exercise) => exercise.id === Number(exerciseId)
          );
          if (exerciseToShow) {
            resolve(exerciseToShow);
          } else {
            reject(new Error('Exercise not found'));
          }
        }, 750);
      });
    },
    createOne: (data) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newExercise = { id: exercises.length + 1, ...data };
          setExercises(prev => [...prev, newExercise]);
          resolve(newExercise);
        }, 750);
      });
    },
    updateOne: (exerciseId, data) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let updatedExercise = null;
          setExercises(prev =>
            prev.map((exercise) => {
              if (exercise.id === Number(exerciseId)) {
                updatedExercise = { ...exercise, ...data };
                return updatedExercise;
              }
              return exercise;
            })
          );
          if (updatedExercise) {
            resolve(updatedExercise);
          } else {
            reject(new Error('Exercise not found'));
          }
        }, 750);
      });
    },
    deleteOne: (exerciseId) => {
      return new Promise((resolve) => {
        setTimeout(async () => {
          const response = await fetch('/api/exercise', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ exerciseId: exerciseId }),
          });
          let data;
          if (response.ok) {
            data = await response.json();
            setExercises(data.exercises);
          }
          if (data.exercises.length === 0) {
            nextRouter.push(createPath);
          }
          resolve();
        }, 750);
      });
    },
    validate: (formValues) => {
      let issues = [];
      if (!formValues.name) {
        issues = [...issues, { message: 'Name is required', path: ['name'] }];
      }
      if (formValues.name && formValues.name.length < 3) {
        issues = [
          ...issues,
          { message: 'Name must be at least 3 characters long', path: ['name'] },
        ];
      }
      if (!formValues.description) {
        issues = [...issues, { message: 'Description is required', path: ['description'] }];
      }
      return { issues };
    },
  }), [exercises]);

  // Initialize a cache instance (remains constant).
  const exercisesCache = useMemo(() => new DataSourceCache(), []);

  // Determine the page title based on the current route.
  const title = useMemo(() => {
    if (router.pathname === createPath) {
      return 'New Exercise';
    }
    const editExerciseId = matchPath(editPath, router.pathname);
    if (editExerciseId) {
      return `Exercise ${editExerciseId} - Edit`;
    }
    const showExerciseId = matchPath(showPath, router.pathname);
    if (showExerciseId) {
      return `Exercise ${showExerciseId}`;
    }
    return undefined;
  }, [router.pathname, createPath, editPath, showPath]);

  // Handlers for navigation actions.
  const handleRowClick = useCallback(
    (exerciseId) => {
      router.navigate(`${rootPath}/${String(exerciseId)}`);
    },
    [router, rootPath]
  );

  const handleCreateClick = useCallback(() => {
    nextRouter.push(createPath);
  }, [router, createPath]);

  const handleEditClick = useCallback(
    (exerciseId) => {
      router.push(`${rootPath}/${String(exerciseId)}/edit`);
    },
    [router, rootPath]
  );

  const handleCreate = useCallback(() => {
    router.navigate(listPath);
  }, [router, listPath]);

  const handleEdit = useCallback(() => {
    router.navigate(listPath);
  }, [router, listPath]);

  const handleDelete = useCallback(() => {
    router.navigate(listPath);
  }, [router, listPath]);

  const showExerciseId = matchPath(showPath, router.pathname);
  const editExerciseId = matchPath(editPath, router.pathname);

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={window !== undefined ? window() : undefined}
    >
      <PageContainer title={title}>
        <CrudProvider
          dataSource={exercisesDataSource}
          dataSourceCache={exercisesCache}
        >
          {router.pathname === listPath && (
            <List
              initialPageSize={10}
              onRowClick={handleRowClick}
              onCreateClick={handleCreateClick}
              onEditClick={handleEditClick}
            />
          )}
          {router.pathname === createPath && (
            <Create
              initialValues={{ name: 'New Exercise', description: '' }}
              onSubmitSuccess={handleCreate}
              resetOnSubmit={false}
            />
          )}
          {router.pathname !== createPath && showExerciseId && (
            <Show
              id={showExerciseId}
              onEditClick={handleEditClick}
              onDelete={handleDelete}
            />
          )}
          {editExerciseId && (
            <Edit id={editExerciseId} onSubmitSuccess={handleEdit} />
          )}
        </CrudProvider>
      </PageContainer>
    </AppProvider>
  );
}

CrudAdvanced.propTypes = {
  window: PropTypes.func,
};

export default CrudAdvanced;
