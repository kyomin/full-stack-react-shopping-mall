import { useInfiniteQuery } from 'react-query';
import ProductList from '../../components/product/list';
import { QueryKeys, graphqlFetcher } from '../../queryClient';
import { GET_PRODUCTS, Products } from '../../graphql/products';
import { useEffect, useRef } from 'react';
import useIntersection from '../../hooks/useIntersection';
import AdminItem from '../../components/admin/item';
import AddForm from '../../components/admin/addForm';

const AdminPage = () => {
  const fetchMoreRef = useRef<HTMLDivElement>(null);
  const intersecting = useIntersection(fetchMoreRef);

  const { data, isSuccess, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery<Products>(
      [QueryKeys.PRODUCTS, 'admin'],
      ({ pageParam = '' }) =>
        graphqlFetcher<Products>(GET_PRODUCTS, {
          cursor: pageParam,
          showDeleted: true,
        }),
      {
        getNextPageParam: (lastPage) => {
          return lastPage.products.at(-1)?.id;
        },
      }
    );

  useEffect(() => {
    if (!intersecting || !isSuccess || !hasNextPage || isFetchingNextPage) {
      return;
    }

    fetchNextPage();
  }, [intersecting]);

  return (
    <div>
      <h2>어드민</h2>
      <AddForm />
      <ProductList list={data?.pages || []} Item={AdminItem} />
      <div ref={fetchMoreRef}></div>
    </div>
  );
};

export default AdminPage;
