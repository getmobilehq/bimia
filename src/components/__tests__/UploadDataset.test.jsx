import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploadDataset from '../UploadDataset';

jest.mock('../../hooks/useUploads', () => ({
  useUploadFile: () => ({
    mutate: jest.fn((_, { onSuccess }) => onSuccess()),
    isLoading: false,
    isError: false,
    error: null,
  }),
}));

describe('UploadDataset', () => {
  it('renders form and submits dataset', async () => {
    render(<UploadDataset token="test-token" />);
    fireEvent.change(screen.getByLabelText(/Dataset Name/i), { target: { value: 'Test Dataset' } });
    fireEvent.change(screen.getByLabelText(/Dataset Description/i), { target: { value: 'Test Description' } });
    const file = new File(['dummy'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(screen.getByLabelText(/Dataset File/i), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /upload dataset/i }));
    await waitFor(() => {
      expect(screen.getByText(/dataset uploaded successfully/i)).toBeInTheDocument();
    });
  });
});
