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
  GetTagsIdParams,
  GetTagsParams,
  TagListResponse,
  TagRequest,
  TagResponse,
} from './strapi.schemas';
import { API } from '../../services/api/index';
import type { ErrorType } from '../../services/api/index';

export const getTags = (params?: GetTagsParams, signal?: AbortSignal) => {
  return API<TagListResponse>({ url: `/tags`, method: 'get', params, signal });
};

export const getGetTagsQueryKey = (params?: GetTagsParams) => {
  return [`/tags`, ...(params ? [params] : [])] as const;
};

export const getGetTagsInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof getTags>>,
  TError = ErrorType<Error>
>(
  params?: GetTagsParams,
  options?: { query?: UseInfiniteQueryOptions<Awaited<ReturnType<typeof getTags>>, TError, TData> }
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetTagsQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getTags>>> = ({ signal, pageParam }) =>
    getTags({ 'pagination[page]': pageParam, ...params }, signal);

  return { queryKey, queryFn, staleTime: 10000, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getTags>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetTagsInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getTags>>>;
export type GetTagsInfiniteQueryError = ErrorType<Error>;

export const useGetTagsInfinite = <
  TData = Awaited<ReturnType<typeof getTags>>,
  TError = ErrorType<Error>
>(
  params?: GetTagsParams,
  options?: { query?: UseInfiniteQueryOptions<Awaited<ReturnType<typeof getTags>>, TError, TData> }
): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetTagsInfiniteQueryOptions(params, options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const getGetTagsQueryOptions = <
  TData = Awaited<ReturnType<typeof getTags>>,
  TError = ErrorType<Error>
>(
  params?: GetTagsParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getTags>>, TError, TData> }
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetTagsQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getTags>>> = ({ signal }) =>
    getTags(params, signal);

  return { queryKey, queryFn, staleTime: 10000, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getTags>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetTagsQueryResult = NonNullable<Awaited<ReturnType<typeof getTags>>>;
export type GetTagsQueryError = ErrorType<Error>;

export const useGetTags = <TData = Awaited<ReturnType<typeof getTags>>, TError = ErrorType<Error>>(
  params?: GetTagsParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getTags>>, TError, TData> }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetTagsQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const postTags = (tagRequest: TagRequest) => {
  return API<TagResponse>({
    url: `/tags`,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: tagRequest,
  });
};

export const getPostTagsMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postTags>>,
    TError,
    { data: TagRequest },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postTags>>,
  TError,
  { data: TagRequest },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<Awaited<ReturnType<typeof postTags>>, { data: TagRequest }> = (
    props
  ) => {
    const { data } = props ?? {};

    return postTags(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostTagsMutationResult = NonNullable<Awaited<ReturnType<typeof postTags>>>;
export type PostTagsMutationBody = TagRequest;
export type PostTagsMutationError = ErrorType<Error>;

export const usePostTags = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postTags>>,
    TError,
    { data: TagRequest },
    TContext
  >;
}) => {
  const mutationOptions = getPostTagsMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getTagsId = (id: number, params?: GetTagsIdParams, signal?: AbortSignal) => {
  return API<TagResponse>({ url: `/tags/${id}`, method: 'get', params, signal });
};

export const getGetTagsIdQueryKey = (id: number, params?: GetTagsIdParams) => {
  return [`/tags/${id}`, ...(params ? [params] : [])] as const;
};

export const getGetTagsIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getTagsId>>,
  TError = ErrorType<Error>
>(
  id: number,
  params?: GetTagsIdParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getTagsId>>, TError, TData> }
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetTagsIdQueryKey(id, params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getTagsId>>> = ({ signal }) =>
    getTagsId(id, params, signal);

  return { queryKey, queryFn, enabled: !!id, staleTime: 10000, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getTagsId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetTagsIdQueryResult = NonNullable<Awaited<ReturnType<typeof getTagsId>>>;
export type GetTagsIdQueryError = ErrorType<Error>;

export const useGetTagsId = <
  TData = Awaited<ReturnType<typeof getTagsId>>,
  TError = ErrorType<Error>
>(
  id: number,
  params?: GetTagsIdParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getTagsId>>, TError, TData> }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetTagsIdQueryOptions(id, params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const putTagsId = (id: number, tagRequest: TagRequest) => {
  return API<TagResponse>({
    url: `/tags/${id}`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data: tagRequest,
  });
};

export const getPutTagsIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putTagsId>>,
    TError,
    { id: number; data: TagRequest },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putTagsId>>,
  TError,
  { id: number; data: TagRequest },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putTagsId>>,
    { id: number; data: TagRequest }
  > = (props) => {
    const { id, data } = props ?? {};

    return putTagsId(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutTagsIdMutationResult = NonNullable<Awaited<ReturnType<typeof putTagsId>>>;
export type PutTagsIdMutationBody = TagRequest;
export type PutTagsIdMutationError = ErrorType<Error>;

export const usePutTagsId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putTagsId>>,
    TError,
    { id: number; data: TagRequest },
    TContext
  >;
}) => {
  const mutationOptions = getPutTagsIdMutationOptions(options);

  return useMutation(mutationOptions);
};
export const deleteTagsId = (id: number) => {
  return API<number>({ url: `/tags/${id}`, method: 'delete' });
};

export const getDeleteTagsIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteTagsId>>,
    TError,
    { id: number },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteTagsId>>,
  TError,
  { id: number },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteTagsId>>, { id: number }> = (
    props
  ) => {
    const { id } = props ?? {};

    return deleteTagsId(id);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteTagsIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteTagsId>>>;

export type DeleteTagsIdMutationError = ErrorType<Error>;

export const useDeleteTagsId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteTagsId>>,
    TError,
    { id: number },
    TContext
  >;
}) => {
  const mutationOptions = getDeleteTagsIdMutationOptions(options);

  return useMutation(mutationOptions);
};
