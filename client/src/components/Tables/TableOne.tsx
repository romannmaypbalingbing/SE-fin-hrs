import { BRAND } from '../../types/brand';

const brandData: BRAND[] = [
  {
    resID: 'R37467',
    customer: 'John Doe',
    rooms: 'r201',
    checkin: '09-01',
    checkout: '09-01',
  },
  {
    resID: 'R37468',
    customer: 'Jane Doe',
    rooms: 'r202',
    checkin: '09-01',
    checkout: '09-01',
  },
  {
    resID: 'R37469',
    customer: 'John Doe',
    rooms: 'r203',
    checkin: '09-01',
    checkout: '09-01',
  },
];

const TableOne = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Arriving Today
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-sm">
             RES ID
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-sm">
              CUSTOMER
            </h5>
          </div>
   
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-sm">
              ROOMS
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-sm">
              CHECKIN
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-sm">
              CHECKOUT
            </h5>
          </div>
        </div>

        {brandData.map((brand, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === brandData.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="hidden text-black text-sm dark:text-white sm:block">
                {brand.resID}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black text-sm dark:text-white">{brand.customer}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black text-sm dark:text-white">{brand.rooms}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5 text-sm">{brand.checkin}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5 text-sm">{brand.checkout}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
