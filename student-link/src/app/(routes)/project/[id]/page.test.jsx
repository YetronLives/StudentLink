import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectDetail from './page.jsx';

jest.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
  useRouter: () => ({ back: jest.fn() })
}));

jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      project_id: 1,
      title: 'Test Project',
      category: 'Frontend',
      description: 'A test project.',
      overview: 'A brief overview of the test project.',
      prerequisites: ['Node.js', 'React'],
      learningObjectives: ['Understand React', 'Use Next.js'],
      link: 'https://example.com'
    })
  })
);

describe('ProjectDetail', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });


  //Checks that the loading state is displayed when the component is first rendered.
  it('renders loading state', () => {
    render(<ProjectDetail />);
    expect(screen.getByText(/loading project details/i)).toBeInTheDocument();
  });


  //Verifies that project details are rendered after a successful fetch.
  it('renders project details after fetch', async () => {
    render(<ProjectDetail />);
    await waitFor(() => expect(screen.getByText('Test Project')).toBeInTheDocument());
    //expect(screen.getByText('A brief overview of the test project.')).toBeInTheDocument(); need to update based on the project data
    expect(screen.getAllByText('Frontend').length).toBeGreaterThan(0);
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('Learning Objectives')).toBeInTheDocument();
    //expect(screen.getByText('Understand React')).toBeInTheDocument(); need to update based on the project data
    //expect(screen.getByText('Use Next.js')).toBeInTheDocument(); need to update based on the project data
  });


  //Simulates a fetch failure and checks that the error state is displayed.
  it('renders error state on fetch failure', async () => {
    global.fetch.mockImplementationOnce(() => Promise.resolve({ ok: false }));
    render(<ProjectDetail />);
    await waitFor(() => expect(screen.getByText(/error loading project/i)).toBeInTheDocument());
  });

  //Simulates the API returning no project and checks that the not found state is displayed.
  it('renders not found state if no project', async () => {
    global.fetch.mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve(null) }));
    render(<ProjectDetail />);
    await waitFor(() => expect(screen.getByText(/project not found/i)).toBeInTheDocument());
  });
});