// React Query hooks for uploads/datasets
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api';

export function useUploads() {
  return useQuery({
    queryKey: ['uploads'],
    queryFn: () => api.listUploads(),
    retry: 1
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, data_description, table_name }) => api.uploadFile(file, data_description, table_name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['uploads'] })
  });
}

export function useDeleteUpload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (upload_id) => api.deleteUpload(upload_id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['uploads'] })
  });
}

export function useUpdateUpload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ upload_id, file, data_description, table_name }) => api.updateUpload(upload_id, file, data_description, table_name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['uploads'] })
  });
}