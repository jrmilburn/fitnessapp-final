"use client";

import * as React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
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
    segment: 'programs',
    title: 'Programs',
    icon: <StickyNote2Icon />,
    pattern: 'programs{/:programId}*',
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
  const rootPath = '/programs';
  const router = useDemoRouter(rootPath);
  const nextRouter = useRouter();

  // Define route paths.
  const listPath = rootPath;
  const createPath = `/new`;
  const showPath = `${rootPath}/:programId`;
  const editPath = `${rootPath}/:programId/edit`;

  // Fetch programs from API and store in state.
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    fetch('/api/programs')
      .then(response => response.json())
      .then(data => {
        if (!data || data.length === 0) {
          nextRouter.push(createPath);
          return;
        }
        setPrograms(data);
      })
      .catch((error) => {
        console.error("Error fetching programs:", error);
      });
  }, [router, createPath]);

  // Create a data source that uses the current programs state.
  const programsDataSource = useMemo(() => ({
    fields: [
      { field: 'id', headerName: 'ID' },
      { field: 'name', headerName: 'Program Name', flex: 1 },
      { field: 'length', headerName: 'Duration (Weeks)', flex: 1 },
      { field: 'days', headerName: 'Days / Week', flex: 1 },
    ],
    getMany: ({ paginationModel, filterModel, sortModel }) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          let processedPrograms = [...programs];

          // Apply filters (demo only)
          if (filterModel?.items?.length) {
            filterModel.items.forEach(({ field, value, operator }) => {
              if (!field || value == null) return;
              processedPrograms = processedPrograms.filter((program) => {
                const programValue = program[field];
                switch (operator) {
                  case 'contains':
                    return String(programValue)
                      .toLowerCase()
                      .includes(String(value).toLowerCase());
                  case 'equals':
                    return programValue === value;
                  case 'startsWith':
                    return String(programValue)
                      .toLowerCase()
                      .startsWith(String(value).toLowerCase());
                  case 'endsWith':
                    return String(programValue)
                      .toLowerCase()
                      .endsWith(String(value).toLowerCase());
                  case '>':
                    return programValue > value;
                  case '<':
                    return programValue < value;
                  default:
                    return true;
                }
              });
            });
          }

          // Apply sorting
          if (sortModel?.length) {
            processedPrograms.sort((a, b) => {
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
          const paginatedPrograms = processedPrograms.slice(start, end);

          resolve({
            items: paginatedPrograms,
            itemCount: processedPrograms.length,
          });
        }, 750);
      });
    },
    getOne: (programId) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const programToShow = programs.find(
            (program) => program.id === Number(programId)
          );
          if (programToShow) {
            resolve(programToShow);
          } else {
            reject(new Error('Program not found'));
          }
        }, 750);
      });
    },
    createOne: (data) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newProgram = { id: programs.length + 1, ...data };
          setPrograms(prev => [...prev, newProgram]);
          resolve(newProgram);
        }, 750);
      });
    },
    updateOne: (programId, data) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let updatedProgram = null;
          setPrograms(prev =>
            prev.map((program) => {
              if (program.id === Number(programId)) {
                updatedProgram = { ...program, ...data };
                return updatedProgram;
              }
              return program;
            })
          );
          if (updatedProgram) {
            resolve(updatedProgram);
          } else {
            reject(new Error('Program not found'));
          }
        }, 750);
      });
    },
    deleteOne: (programId) => {
      return new Promise((resolve) => {
        setTimeout(async () => {
          const response = await fetch('/api/program', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ programId: programId }),
          });
          let data;
          if (response.ok) {
            data = await response.json();
            setPrograms(data.programs);
          }
          if (data.programs.length === 0) {
            nextRouter.push(createPath);
          }
          resolve();
        }, 750);
      });
    },
    validate: (formValues) => {
      let issues = [];
      if (!formValues.title) {
        issues = [...issues, { message: 'Title is required', path: ['title'] }];
      }
      if (formValues.title && formValues.title.length < 3) {
        issues = [
          ...issues,
          { message: 'Title must be at least 3 characters long', path: ['title'] },
        ];
      }
      if (!formValues.text) {
        issues = [...issues, { message: 'Text is required', path: ['text'] }];
      }
      return { issues };
    },
  }), [programs]);

  // Initialize a cache instance (remains constant).
  const programsCache = useMemo(() => new DataSourceCache(), []);

  // Determine the page title based on the current route.
  const title = useMemo(() => {
    if (router.pathname === createPath) {
      return 'New Program';
    }
    const editProgramId = matchPath(editPath, router.pathname);
    if (editProgramId) {
      return `Program ${editProgramId} - Edit`;
    }
    const showProgramId = matchPath(showPath, router.pathname);
    if (showProgramId) {
      return `Program ${showProgramId}`;
    }
    return undefined;
  }, [router.pathname, createPath, editPath, showPath]);

  // Handlers for navigation actions.
  const handleRowClick = useCallback(
    (programId) => {
      router.navigate(`${rootPath}/${String(programId)}`);
    },
    [router, rootPath]
  );

  const handleCreateClick = useCallback(() => {
    nextRouter.push(createPath);
  }, [router, createPath]);

  const handleEditClick = useCallback(
    (programId) => {
      router.push(`program/${String(programId)}`);
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

  const showProgramId = matchPath(showPath, router.pathname);
  const editProgramId = matchPath(editPath, router.pathname);

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={window !== undefined ? window() : undefined}
    >
        <PageContainer title={title}>
          <CrudProvider
            dataSource={programsDataSource}
            dataSourceCache={programsCache}
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
                initialValues={{ title: 'New program' }}
                onSubmitSuccess={handleCreate}
                resetOnSubmit={false}
              />
            )}
            {router.pathname !== createPath && showProgramId && (
              <Show
                id={showProgramId}
                onEditClick={handleEditClick}
                onDelete={handleDelete}
              />
            )}
            {editProgramId && (
              <Edit id={editProgramId} onSubmitSuccess={handleEdit} />
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
