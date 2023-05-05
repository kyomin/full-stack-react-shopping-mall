import { Product } from '../../graphql/products';
import AdminItem from './item';

const AdminList = ({
  list,
  editingIndex,
  startEdit,
  cancelEdit
}: {
  list: { products: Product[] }[];
  editingIndex: number | null;
  startEdit: (index: number) => () => void;
  cancelEdit: () => () => void;
}) => {
  return (
    <ul className='products'>
      {list?.map((page) =>
        page.products.map((product, index) => (
          <AdminItem
            {...product}
            key={product.id}
            idEditing={editingIndex === index}
            startEdit={startEdit(index)}
            cancelEdit={cancelEdit()}
          />
        ))
      )}
    </ul>
  );
};

export default AdminList;
