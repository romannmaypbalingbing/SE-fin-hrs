import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import Rooms from '../components/Tables/Rooms';

const Tables = () => {
  return (
    <>
      <Breadcrumb pageName="Rooms" />

      <div className="flex flex-col gap-10">
        <Rooms />

      </div>
    </>
  );
};

export default Tables;
