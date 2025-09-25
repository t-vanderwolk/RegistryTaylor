const blogQuestionsController = require('../controllers/blogQuestionsController');

let capturedUpdates;
const mockUpdateReturning = jest.fn();

const mockDbFunction = jest.fn((tableName) => {
  if (tableName === 'blog_questions') {
    return {
      where: jest.fn(() => ({
        update: jest.fn((updates) => {
          capturedUpdates = updates;
          return {
            returning: mockUpdateReturning,
          };
        }),
      })),
    };
  }

  if (tableName === 'blog_questions as q') {
    const builder = {
      leftJoin: jest.fn(() => builder),
      select: jest.fn(() => builder),
      where: jest.fn(() => builder),
      limit: jest.fn(() => Promise.resolve([
        {
          id: 'question-123',
          username: 'Taylor',
          email: 'parent@example.com',
          question: 'Original question',
          answer: 'Great answer',
          status: 'published',
          assigned_to: null,
          assigned_name: null,
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
        },
      ])),
    };
    return builder;
  }

  throw new Error(`Unexpected table: ${tableName}`);
});

mockUpdateReturning.mockImplementation(() => Promise.resolve([
  {
    id: 'question-123',
    username: 'Taylor',
  },
]));

jest.mock('../db/connection', () => {
  const original = jest.requireActual('../db/connection');
  return Object.assign((...args) => mockDbFunction(...args), {
    fn: { now: jest.fn(() => '2024-01-01T00:00:00.000Z') },
  });
});

describe('blogQuestionsController.update', () => {
  beforeEach(() => {
    capturedUpdates = undefined;
    mockUpdateReturning.mockClear();
    mockDbFunction.mockClear();
  });

  it('trims username and publishes admin answers without throwing', async () => {
    const req = {
      params: { id: 'question-123' },
      body: {
        username: '  Taylor  ',
        answer: '  New answer from admin ',
        status: 'published',
      },
    };

    const res = {
      json: jest.fn(),
    };

    const next = jest.fn();

    await blogQuestionsController.update(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(mockUpdateReturning).toHaveBeenCalled();
    expect(capturedUpdates).toMatchObject({
      username: 'Taylor',
      answer: 'New answer from admin',
      status: 'published',
    });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ id: 'question-123', username: 'Taylor' }),
      })
    );
  });
});
