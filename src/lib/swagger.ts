export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'DoneToday API',
    version: '1.0.0',
    description: 'REST API for DoneToday app',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['USER', 'ADMIN'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      UserSettings: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          historyMode: { type: 'string', enum: ['BY_EXERCISE', 'BY_ROUTINE'] },
          defaultRestSeconds: { type: 'integer' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Exercise: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          muscleGroups: { type: 'array', items: { type: 'string' } },
          equipment: { type: 'array', items: { type: 'string' } },
          exerciseTypes: { type: 'array', items: { type: 'string' } },
          metricType: { type: 'string', enum: ['REPS', 'WEIGHT_REPS', 'TIME', 'WEIGHT_TIME', 'WEIGHT_REPS_TIME'] },
          imageUrl: { type: 'string', nullable: true },
          videoUrl: { type: 'string', nullable: true },
          isCustom: { type: 'boolean' },
          createdBy: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      RoutineExercise: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          routineId: { type: 'string', format: 'uuid' },
          exerciseId: { type: 'string', format: 'uuid' },
          order: { type: 'integer' },
          sets: { type: 'integer' },
          restSeconds: { type: 'integer' },
          exercise: { $ref: '#/components/schemas/Exercise' },
        },
      },
      Routine: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
          isPublic: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          exercises: { type: 'array', items: { $ref: '#/components/schemas/RoutineExercise' } },
        },
      },
      WorkoutSet: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          workoutId: { type: 'string', format: 'uuid' },
          exerciseId: { type: 'string', format: 'uuid' },
          setNumber: { type: 'integer' },
          weight: { type: 'number', nullable: true },
          reps: { type: 'integer', nullable: true },
          duration: { type: 'integer', nullable: true },
          setType: { type: 'string', enum: ['NORMAL', 'WARMUP', 'FEEDER', 'DROPSET', 'FAILURE', 'CLUSTER_SET', 'POINT_ZERO', 'CONCENTRATION_PIKE'] },
          completed: { type: 'boolean' },
          exercise: { $ref: '#/components/schemas/Exercise' },
        },
      },
      Workout: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          routineId: { type: 'string', format: 'uuid', nullable: true },
          name: { type: 'string' },
          startedAt: { type: 'string', format: 'date-time' },
          finishedAt: { type: 'string', format: 'date-time', nullable: true },
          notes: { type: 'string', nullable: true },
          routine: { type: 'object', nullable: true, properties: { id: { type: 'string' }, name: { type: 'string' } } },
          sets: { type: 'array', items: { $ref: '#/components/schemas/WorkoutSet' } },
        },
      },
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Fabio Morais' },
                  email: { type: 'string', example: 'fabio@email.com' },
                  password: { type: 'string', example: '123456' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User created', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          500: { description: 'Internal server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'fabio@email.com' },
                  password: { type: 'string', example: '123456' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' },
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          500: { description: 'Internal server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Request password reset email',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', example: 'fabio@email.com' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Reset email sent', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset password with token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token', 'password'],
                properties: {
                  token: { type: 'string' },
                  password: { type: 'string', example: 'newpassword123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Password reset successfully', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          500: { description: 'Internal server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/users/me': {
      get: {
        tags: ['Users'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'User profile', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Update current user profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Fabio Morais' },
                  email: { type: 'string', example: 'fabio@email.com' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'User updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete current user account',
        security: [{ bearerAuth: [] }],
        responses: {
          204: { description: 'User deleted' },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/user-settings': {
      get: {
        tags: ['User Settings'],
        summary: 'Get current user settings',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'User settings', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserSettings' } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      put: {
        tags: ['User Settings'],
        summary: 'Update current user settings',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  historyMode: { type: 'string', enum: ['BY_EXERCISE', 'BY_ROUTINE'] },
                  defaultRestSeconds: { type: 'integer', example: 90 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Settings updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserSettings' } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/exercises': {
      get: {
        tags: ['Exercises'],
        summary: 'List all global exercises',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of exercises', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Exercise' } } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      post: {
        tags: ['Exercises'],
        summary: 'Create a custom exercise',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'muscleGroups', 'exerciseTypes', 'metricType'],
                properties: {
                  name: { type: 'string', example: 'Weighted Pull Up' },
                  muscleGroups: { type: 'array', items: { type: 'string' }, example: ['LATISSIMUS', 'BICEPS'] },
                  equipment: { type: 'array', items: { type: 'string' }, example: ['BARBELL'] },
                  exerciseTypes: { type: 'array', items: { type: 'string' }, example: ['STRENGTH'] },
                  metricType: { type: 'string', enum: ['REPS', 'WEIGHT_REPS', 'TIME', 'WEIGHT_TIME', 'WEIGHT_REPS_TIME'] },
                  imageUrl: { type: 'string', nullable: true },
                  videoUrl: { type: 'string', nullable: true },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Exercise created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Exercise' } } } },
          400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/exercises/me': {
      get: {
        tags: ['Exercises'],
        summary: 'List current user custom exercises',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of custom exercises', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Exercise' } } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/exercises/{id}': {
      get: {
        tags: ['Exercises'],
        summary: 'Get exercise by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Exercise found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Exercise' } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Exercise not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      put: {
        tags: ['Exercises'],
        summary: 'Update a custom exercise',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  muscleGroups: { type: 'array', items: { type: 'string' } },
                  equipment: { type: 'array', items: { type: 'string' } },
                  exerciseTypes: { type: 'array', items: { type: 'string' } },
                  metricType: { type: 'string', enum: ['REPS', 'WEIGHT_REPS', 'TIME', 'WEIGHT_TIME', 'WEIGHT_REPS_TIME'] },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Exercise updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Exercise' } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'Access denied', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Exercise not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      delete: {
        tags: ['Exercises'],
        summary: 'Delete a custom exercise',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          204: { description: 'Exercise deleted' },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'Access denied', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Exercise not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/routines': {
      get: {
        tags: ['Routines'],
        summary: 'List public routines and own routines',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of routines', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Routine' } } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      post: {
        tags: ['Routines'],
        summary: 'Create a new routine',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'exercises'],
                properties: {
                  name: { type: 'string', example: 'Full Body Strength' },
                  description: { type: 'string', nullable: true },
                  isPublic: { type: 'boolean', example: false },
                  exercises: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        exerciseId: { type: 'string', format: 'uuid' },
                        order: { type: 'integer' },
                        sets: { type: 'integer' },
                        restSeconds: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Routine created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Routine' } } } },
          400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/routines/me': {
      get: {
        tags: ['Routines'],
        summary: 'List current user routines',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of routines', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Routine' } } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/routines/{id}': {
      get: {
        tags: ['Routines'],
        summary: 'Get routine by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Routine found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Routine' } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Routine not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      put: {
        tags: ['Routines'],
        summary: 'Update a routine',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  isPublic: { type: 'boolean' },
                  exercises: { type: 'array', items: { type: 'object' } },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Routine updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Routine' } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'Access denied', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Routine not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      delete: {
        tags: ['Routines'],
        summary: 'Delete a routine',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          204: { description: 'Routine deleted' },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'Access denied', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Routine not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/workouts': {
      get: {
        tags: ['Workouts'],
        summary: 'List all workouts of current user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of workouts', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Workout' } } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/workouts/start': {
      post: {
        tags: ['Workouts'],
        summary: 'Start a new workout session',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Full Body Strength' },
                  routineId: { type: 'string', format: 'uuid', nullable: true },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Workout started', content: { 'application/json': { schema: { $ref: '#/components/schemas/Workout' } } } },
          400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/workouts/{id}': {
      get: {
        tags: ['Workouts'],
        summary: 'Get workout by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Workout found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Workout' } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Workout not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      delete: {
        tags: ['Workouts'],
        summary: 'Delete a workout',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          204: { description: 'Workout deleted' },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Workout not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/workouts/{id}/save': {
      post: {
        tags: ['Workouts'],
        summary: 'Save and finish a workout session',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['sets'],
                properties: {
                  notes: { type: 'string', nullable: true },
                  sets: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        exerciseId: { type: 'string', format: 'uuid' },
                        setNumber: { type: 'integer' },
                        weight: { type: 'number', nullable: true },
                        reps: { type: 'integer', nullable: true },
                        duration: { type: 'integer', nullable: true },
                        setType: { type: 'string', enum: ['NORMAL', 'WARMUP', 'FEEDER', 'DROPSET', 'FAILURE', 'CLUSTER_SET', 'POINT_ZERO', 'CONCENTRATION_PIKE'] },
                        completed: { type: 'boolean' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Workout saved', content: { 'application/json': { schema: { $ref: '#/components/schemas/Workout' } } } },
          400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Workout not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/workouts/history/{exerciseId}': {
      get: {
        tags: ['Workouts'],
        summary: 'Get last sets for an exercise (progression history)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'exerciseId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'routineId', in: 'query', required: false, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Last sets for exercise', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/WorkoutSet' } } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/admin/users': {
      get: {
        tags: ['Admin'],
        summary: 'List all users',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of users', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'Access denied', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/admin/users/{id}': {
      get: {
        tags: ['Admin'],
        summary: 'Get user by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'User found', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'Access denied', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      put: {
        tags: ['Admin'],
        summary: 'Update user by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  role: { type: 'string', enum: ['USER', 'ADMIN'] },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'User updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'Access denied', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      delete: {
        tags: ['Admin'],
        summary: 'Delete user by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          204: { description: 'User deleted' },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'Access denied', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
  },
}