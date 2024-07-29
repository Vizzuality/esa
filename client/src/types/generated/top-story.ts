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
  Error,
  GetTopStoriesIdParams,
  GetTopStoriesParams,
  TopStoryListResponse,
  TopStoryRequest,
  TopStoryResponse,
} from './strapi.schemas';
import { API } from '../../services/api/index';
import type { ErrorType } from '../../services/api/index';

export const getTopStories = (params?: GetTopStoriesParams, signal?: AbortSignal) => {
  return API<TopStoryListResponse>({ url: `/top-stories`, method: 'get', params, signal });
};

export const getGetTopStoriesQueryKey = (params?: GetTopStoriesParams) => {
  return [`/top-stories`, ...(params ? [params] : [])] as const;
};

export const getGetTopStoriesInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof getTopStories>>,
  TError = ErrorType<Error>
>(
  params?: GetTopStoriesParams,
  options?: {
    query?: UseInfiniteQueryOptions<Awaited<ReturnType<typeof getTopStories>>, TError, TData>;
  }
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetTopStoriesQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getTopStories>>> = ({
    signal,
    pageParam,
  }) => getTopStories({ 'pagination[page]': pageParam, ...params }, signal);

  return { queryKey, queryFn, staleTime: 10000, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getTopStories>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetTopStoriesInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getTopStories>>
>;
export type GetTopStoriesInfiniteQueryError = ErrorType<Error>;

export const useGetTopStoriesInfinite = <
  TData = Awaited<ReturnType<typeof getTopStories>>,
  TError = ErrorType<Error>
>(
  params?: GetTopStoriesParams,
  options?: {
    query?: UseInfiniteQueryOptions<Awaited<ReturnType<typeof getTopStories>>, TError, TData>;
  }
): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetTopStoriesInfiniteQueryOptions(params, options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const getGetTopStoriesQueryOptions = <
  TData = Awaited<ReturnType<typeof getTopStories>>,
  TError = ErrorType<Error>
>(
  params?: GetTopStoriesParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getTopStories>>, TError, TData> }
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetTopStoriesQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getTopStories>>> = ({ signal }) =>
    getTopStories(params, signal);

  return { queryKey, queryFn, staleTime: 10000, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getTopStories>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetTopStoriesQueryResult = NonNullable<Awaited<ReturnType<typeof getTopStories>>>;
export type GetTopStoriesQueryError = ErrorType<Error>;

export const useGetTopStories = <
  TData = Awaited<ReturnType<typeof getTopStories>>,
  TError = ErrorType<Error>
>(
  params?: GetTopStoriesParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getTopStories>>, TError, TData> }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetTopStoriesQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const postTopStories = (topStoryRequest: TopStoryRequest) => {
  return API<TopStoryResponse>({
    url: `/top-stories`,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: topStoryRequest,
  });
};

export const getPostTopStoriesMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postTopStories>>,
    TError,
    { data: TopStoryRequest },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postTopStories>>,
  TError,
  { data: TopStoryRequest },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postTopStories>>,
    { data: TopStoryRequest }
  > = (props) => {
    const { data } = props ?? {};

    return postTopStories(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostTopStoriesMutationResult = NonNullable<Awaited<ReturnType<typeof postTopStories>>>;
export type PostTopStoriesMutationBody = TopStoryRequest;
export type PostTopStoriesMutationError = ErrorType<Error>;

export const usePostTopStories = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postTopStories>>,
    TError,
    { data: TopStoryRequest },
    TContext
  >;
}) => {
  const mutationOptions = getPostTopStoriesMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getTopStoriesId = (
  id: number,
  params?: GetTopStoriesIdParams,
  signal?: AbortSignal
) => {
  return API<TopStoryResponse>({ url: `/top-stories/${id}`, method: 'get', params, signal });
};

export const getGetTopStoriesIdQueryKey = (id: number, params?: GetTopStoriesIdParams) => {
  return [`/top-stories/${id}`, ...(params ? [params] : [])] as const;
};

export const getGetTopStoriesIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getTopStoriesId>>,
  TError = ErrorType<Error>
>(
  id: number,
  params?: GetTopStoriesIdParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getTopStoriesId>>, TError, TData> }
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetTopStoriesIdQueryKey(id, params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getTopStoriesId>>> = ({ signal }) =>
    getTopStoriesId(id, params, signal);

  return { queryKey, queryFn, enabled: !!id, staleTime: 10000, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getTopStoriesId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetTopStoriesIdQueryResult = NonNullable<Awaited<ReturnType<typeof getTopStoriesId>>>;
export type GetTopStoriesIdQueryError = ErrorType<Error>;

export const useGetTopStoriesId = <
  TData = Awaited<ReturnType<typeof getTopStoriesId>>,
  TError = ErrorType<Error>
>(
  id: number,
  params?: GetTopStoriesIdParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getTopStoriesId>>, TError, TData> }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetTopStoriesIdQueryOptions(id, params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const putTopStoriesId = (id: number, topStoryRequest: TopStoryRequest) => {
  return API<TopStoryResponse>({
    url: `/top-stories/${id}`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data: topStoryRequest,
  });
};

export const getPutTopStoriesIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putTopStoriesId>>,
    TError,
    { id: number; data: TopStoryRequest },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putTopStoriesId>>,
  TError,
  { id: number; data: TopStoryRequest },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putTopStoriesId>>,
    { id: number; data: TopStoryRequest }
  > = (props) => {
    const { id, data } = props ?? {};

    return putTopStoriesId(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutTopStoriesIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof putTopStoriesId>>
>;
export type PutTopStoriesIdMutationBody = TopStoryRequest;
export type PutTopStoriesIdMutationError = ErrorType<Error>;

export const usePutTopStoriesId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putTopStoriesId>>,
    TError,
    { id: number; data: TopStoryRequest },
    TContext
  >;
}) => {
  const mutationOptions = getPutTopStoriesIdMutationOptions(options);

  return useMutation(mutationOptions);
};
export const deleteTopStoriesId = (id: number) => {
  return API<number>({ url: `/top-stories/${id}`, method: 'delete' });
};

export const getDeleteTopStoriesIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteTopStoriesId>>,
    TError,
    { id: number },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteTopStoriesId>>,
  TError,
  { id: number },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteTopStoriesId>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return deleteTopStoriesId(id);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteTopStoriesIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteTopStoriesId>>
>;

export type DeleteTopStoriesIdMutationError = ErrorType<Error>;

export const useDeleteTopStoriesId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteTopStoriesId>>,
    TError,
    { id: number },
    TContext
  >;
}) => {
  const mutationOptions = getDeleteTopStoriesIdMutationOptions(options);

  return useMutation(mutationOptions);
};