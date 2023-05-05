import { useEffect, useRef, useState } from 'react';
import AddForm from './addForm';
import useIntersection from '../../hooks/useIntersection';
import { useInfiniteQuery } from 'react-query';
import { QueryKeys, graphqlFetcher } from '../../queryClient';
import { GET_PRODUCTS, Products } from '../../graphql/products';
import AdminList from './list';

const Admin = () => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
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

  const startEdit = (index: number) => () => setEditingIndex(index);
  const cancelEdit = () => () => setEditingIndex(null);

  return (
    <>
      <div className='product-add-form'>
        <h4 style={{ textAlign: 'center' }}>상품 등록</h4>
        <AddForm />
      </div>
      <AdminList
        list={data?.pages || []}
        editingIndex={editingIndex}
        startEdit={startEdit}
        cancelEdit={cancelEdit}
      />
      <div ref={fetchMoreRef}></div>
    </>
  );
};

export default Admin;
