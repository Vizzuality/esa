/**
 * Generated by orval v6.20.0 🍺
 * Do not edit manually.
 * DOCUMENTATION
 * OpenAPI spec version: 1.0.0
 */
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import type {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import type {
  DatasetListResponse,
  DatasetRequest,
  DatasetResponse,
  Error,
  GetDatasetsIdParams,
  GetDatasetsParams,
} from './strapi.schemas';
import { API } from '../../services/api/index';
import type { ErrorType } from '../../services/api/index';

export const getDatasets = (params?: GetDatasetsParams, signal?: AbortSignal) => {
  return API<DatasetListResponse>({ url: `/datasets`, method: 'get', params, signal });
};

export const getGetDatasetsQueryKey = (params?: GetDatasetsParams) => {
  return [`/datasets`, ...(params ? [params] : [])] as const;
};

export const getGetDatasetsInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof getDatasets>>,
  TError = ErrorType<Error>
>(
  params?: GetDatasetsParams,
  options?: {
    query?: UseInfiniteQueryOptions<Awaited<ReturnType<typeof getDatasets>>, TError, TData>;
  }
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetDatasetsQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getDatasets>>> = ({ signal, pageParam }) =>
    getDatasets({ 'pagination[page]': pageParam, ...params }, signal);

  return { queryKey, queryFn, staleTime: 10000, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getDatasets>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetDatasetsInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getDatasets>>>;
export type GetDatasetsInfiniteQueryError = ErrorType<Error>;

export const useGetDatasetsInfinite = <
  TData = Awaited<ReturnType<typeof getDatasets>>,
  TError = ErrorType<Error>
>(
  params?: GetDatasetsParams,
  options?: {
    query?: UseInfiniteQueryOptions<Awaited<ReturnType<typeof getDatasets>>, TError, TData>;
  }
): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetDatasetsInfiniteQueryOptions(params, options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const getGetDatasetsQueryOptions = <
  TData = Awaited<ReturnType<typeof getDatasets>>,
  TError = ErrorType<Error>
>(
  params?: GetDatasetsParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getDatasets>>, TError, TData> }
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetDatasetsQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getDatasets>>> = ({ signal }) =>
    getDatasets(params, signal);

  return { queryKey, queryFn, staleTime: 10000, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getDatasets>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetDatasetsQueryResult = NonNullable<Awaited<ReturnType<typeof getDatasets>>>;
export type GetDatasetsQueryError = ErrorType<Error>;

export const useGetDatasets = <
  TData = Awaited<ReturnType<typeof getDatasets>>,
  TError = ErrorType<Error>
>(
  params?: GetDatasetsParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getDatasets>>, TError, TData> }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetDatasetsQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const postDatasets = (datasetRequest: DatasetRequest) => {
  return API<DatasetResponse>({
    url: `/datasets`,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: datasetRequest,
  });
};

export const getPostDatasetsMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postDatasets>>,
    TError,
    { data: DatasetRequest },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postDatasets>>,
  TError,
  { data: DatasetRequest },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postDatasets>>,
    { data: DatasetRequest }
  > = (props) => {
    const { data } = props ?? {};

    return postDatasets(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostDatasetsMutationResult = NonNullable<Awaited<ReturnType<typeof postDatasets>>>;
export type PostDatasetsMutationBody = DatasetRequest;
export type PostDatasetsMutationError = ErrorType<Error>;

export const usePostDatasets = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postDatasets>>,
    TError,
    { data: DatasetRequest },
    TContext
  >;
}) => {
  const mutationOptions = getPostDatasetsMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getDatasetsId = (id: number, params?: GetDatasetsIdParams, signal?: AbortSignal) => {
  return API<DatasetResponse>({ url: `/datasets/${id}`, method: 'get', params, signal });
};

export const getGetDatasetsIdQueryKey = (id: number, params?: GetDatasetsIdParams) => {
  return [`/datasets/${id}`, ...(params ? [params] : [])] as const;
};

export const getGetDatasetsIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getDatasetsId>>,
  TError = ErrorType<Error>
>(
  id: number,
  params?: GetDatasetsIdParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getDatasetsId>>, TError, TData> }
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetDatasetsIdQueryKey(id, params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getDatasetsId>>> = ({ signal }) =>
    getDatasetsId(id, params, signal);

  return { queryKey, queryFn, enabled: !!id, staleTime: 10000, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getDatasetsId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetDatasetsIdQueryResult = NonNullable<Awaited<ReturnType<typeof getDatasetsId>>>;
export type GetDatasetsIdQueryError = ErrorType<Error>;

export const useGetDatasetsId = <
  TData = Awaited<ReturnType<typeof getDatasetsId>>,
  TError = ErrorType<Error>
>(
  id: number,
  params?: GetDatasetsIdParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getDatasetsId>>, TError, TData> }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetDatasetsIdQueryOptions(id, params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const putDatasetsId = (id: number, datasetRequest: DatasetRequest) => {
  return API<DatasetResponse>({
    url: `/datasets/${id}`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data: datasetRequest,
  });
};

export const getPutDatasetsIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putDatasetsId>>,
    TError,
    { id: number; data: DatasetRequest },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putDatasetsId>>,
  TError,
  { id: number; data: DatasetRequest },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putDatasetsId>>,
    { id: number; data: DatasetRequest }
  > = (props) => {
    const { id, data } = props ?? {};

    return putDatasetsId(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutDatasetsIdMutationResult = NonNullable<Awaited<ReturnType<typeof putDatasetsId>>>;
export type PutDatasetsIdMutationBody = DatasetRequest;
export type PutDatasetsIdMutationError = ErrorType<Error>;

export const usePutDatasetsId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putDatasetsId>>,
    TError,
    { id: number; data: DatasetRequest },
    TContext
  >;
}) => {
  const mutationOptions = getPutDatasetsIdMutationOptions(options);

  return useMutation(mutationOptions);
};
export const deleteDatasetsId = (id: number) => {
  return API<number>({ url: `/datasets/${id}`, method: 'delete' });
};

export const getDeleteDatasetsIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteDatasetsId>>,
    TError,
    { id: number },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteDatasetsId>>,
  TError,
  { id: number },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteDatasetsId>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return deleteDatasetsId(id);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteDatasetsIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteDatasetsId>>
>;

export type DeleteDatasetsIdMutationError = ErrorType<Error>;

export const useDeleteDatasetsId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteDatasetsId>>,
    TError,
    { id: number },
    TContext
  >;
}) => {
  const mutationOptions = getDeleteDatasetsIdMutationOptions(options);

  return useMutation(mutationOptions);
};
