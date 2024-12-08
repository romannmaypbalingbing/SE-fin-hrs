import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TableTwo from '../components/Tables/TableTwo';

const Tables = () => {
  return (
    <>
      <Breadcrumb pageName="Rooms" />

      <div className="flex flex-col gap-10">
        <TableTwo />

      </div>
    </>
  );
};

export default Tables;
