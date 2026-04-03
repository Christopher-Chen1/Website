import  { useEffect, useRef, useState } from 'react';
//import axios from 'axios';
import {
  DDSTable,
  DDSPagination,
  DDSButton,
  DDSLoadingIndicator,
  DDSTooltip,
  DDSLink,
  useNotification,
  DDSNotificationProvider,
  DDSModal,
} from "@dds/react";
import { Bar } from "@dds/dv-components";
import { useUserStore } from '../../store/userStore';

//upload
const FileUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { addNotification } = useNotification();
  const { userInfo } = useUserStore();

  useEffect(() => {
    // console.log('User Info:', userInfo);  // 确保在组件加载时获取正确的 userInfo
  }, [userInfo]);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.xlsx')) {
      setSelectedFile(file);
      setIsOpen(true);
    } else {
      alert('Please upload a valid .xlsx file.');
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
  
      const adUsername = userInfo?.ad_username?.trim() ?? 'unknown';
      // console.log('Sending ad_username:', adUsername);  // 确认发送了正确的 ad_username
  
      formData.append('ad_username', adUsername);
  
      fetch(`${import.meta.env.VITE_API_BASE_URL}/uploadData`, {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(() => {
          // console.log('Success:', data);
          addNotification({
            id: Math.random().toString(),
            header: "Upload Status",
            timeStamp: new Date().toLocaleString(),
            children: "File upload successful."
          });
        })
        .catch(() => {
          // console.error('Error:', error);
          addNotification({
            id: Math.random().toString(),
            header: "Upload Status",
            timeStamp: new Date().toLocaleString(),
            children: "File upload failed."
          });
        });
    }
    setSelectedFile(null);
    setIsOpen(false);
  };
  
  
  

  const handleCancel = () => {
    addNotification({
      id: Math.random().toString(),
      header: "Upload Status",
      timeStamp: new Date().toLocaleString(),
      children: "File upload cancelled."
    });
    setSelectedFile(null);
    setIsOpen(false);
  };

  return (
    <DDSNotificationProvider>
      <div>
        <input
          type="file"
          ref={fileInputRef}
          accept=".xlsx"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <DDSButton onClick={handleButtonClick} icon="import" iconPlacement="end">
          Upload
        </DDSButton>
      </div>
      <DDSModal
        footer={
          <>
            <DDSButton size="md" kind="secondary" onClick={handleCancel}>
              Cancel
            </DDSButton>
            <DDSButton size="md" onClick={handleUpload}>
              Confirm
            </DDSButton>
          </>
        }
        onClose={handleCancel}
        open={isOpen}
        title="Confirm Upload"
      >
        Are you sure you want to upload the file: {selectedFile?.name}?
      </DDSModal>
    </DDSNotificationProvider>
  );
};
//export
const exportData = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/export`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'CS Part Shortage Report.xlsx';
    a.rel = 'noopener';     // 小加固
    a.target = '_self';

    a.click();              // ✅ 不 appendChild
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting data:', error);
  }
};
//part nums count
const DDVBarChart = ({ chartOptions }) => {
  const [data, setData] = useState(chartOptions.data);

  useEffect(() => {
    // Fetch data from the backend
    fetch(`${import.meta.env.VITE_API_BASE_URL}/shortage/partnumcounts`)
      .then((response) => response.json())
      .then((data) => {
        // Assuming the response is an array of objects with "Part Num" and "PartNumCount"
        const formattedData = data.slice(0, 10).map((item) => ({
          name: item["Part Num"],
          points: item.PartNumCount,
        }));
        setData(formattedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      Bar({ ...chartOptions, data });
    }
  }, [data]);

  return (
    // <div className={`ddv__root`}>
    //   <div className="dds__container-fluid">
        <div className="dds__row">
          <div className="dds__col-12 dds__col--md-12 dds__col--lg-12 dds__mb-3">
            <div className="dds__card">
              <div className="dds__card__content">
                <div className="dds__card__header">
                  <span className="dds__card__header__text">
                    <h5 className="dds__card__header__title" tabIndex={1}>
                    CS Orders Impacted By CS Part Num
                    </h5>
                    <span className="dds__card__header__subtitle" tabIndex={1}>
                      
                    </span>
                  </span>
                </div>
                <div className="dds__card__body">
                  <div id="bar_target" data-ddv={`bar`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
    //   </div>
    // </div>
  );
};

const chartOptions = {
  tooltip: { prefix: "", prefixSr: "dollars", unit: "", unitSr: "millions" },
  translations: {},
  alignment: "horizontal",
  data: [], // Initial empty data
  fieldId: "name",
  target: "#bar_target",
  xAxes: { title: "The Count Of CS Orders" },
  yAxes: { title: "Part Num" },
};

//esd aging
const chartOptions_ = {
  sanitize: false,
  tooltip: { prefix: "", prefixSr: "dollars", unit: "", unitSr: "millions" },
  translations: {},
  alignment: "vertical",
  data: [],
  fieldId: "name",
  target: "#bar_3356108065",
  xAxes: { title: "ESD Aging" },
  yAxes: { title: "Count" },
};

const DDVBarChart_ = ({ chartOptions_ }) => {
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/shortage/esdagingcounts`)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((item) => ({
          name: item.ESD_Aging,
          points: item.ESD_AgingCount,
        }));
        chartOptions_.data = formattedData;
        Bar(chartOptions_);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    // <div className={`ddv__root`}>
    //   <div className="dds__container-fluid">
        <div className="dds__row">
          <div className="dds__col-12 dds__col--md-12 dds__col--lg-12 dds__mb-3">
            <div className="dds__card">
              <div className="dds__card__content">
                <div className="dds__card__header">
                  <span className="dds__card__header__text">
                    <h5 className="dds__card__header__title" tabIndex={1}>
                      ESD Aging Count
                    </h5>
                    <span className="dds__card__header__subtitle" tabIndex={1}>
                      
                    </span>
                  </span>
                </div>
                <div className="dds__card__body">
                  <div id="bar_3356108065" data-ddv={`bar`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
    //   </div>
    // </div>
  );
};

// const cellRendering = ({ cell, row }) => {
//   const { value } = cell;
//   const badgeColor =
//     value === "PP"
//       ? "informative"
//       : value === "Warning" || value === "Blocked"
//       ? "warning"
//       : value === "Success"
//       ? "success"
//       : value === "Error"
//       ? "error"
//       : "gray";

//   return (
//     <DDSBadge
//       color={badgeColor}
//       emphasis="medium"
//       size="md"
//       title={row.columns[0].value}
//     >
//       {value}
//     </DDSBadge>
//   );
// };


const ShortageReport = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalItems, setTotalItems] = useState(0);
  const [distinctCSPartNumCount, setDistinctCSPartNumCount] = useState<number | null>(null);
  const [distinctPartNumCount, setDistinctPartNumCount] = useState<number | null>(null);
  const [totalSalesOrderCount, setTotalSalesOrderCount] = useState<number | null>(null);
  const [totalQty, setTotalQty] = useState<number | null>(null);

  const [columns] = useState([
    { value: "Sub_Region(APJN, APJS, AMER, EMEA)", width: 150 },
    { value: "Part Num", width: 140 },
    { value: "Sales Order Number", width: 200 },
    { value: "Part Description", width: 250 },
    { value: "Order Status", width: 140  },
    { value: "Project ID", width: 120 },
    { value: "PM_NAME", width: 150 },
    { value: "Salesrep Name" },
    { value: "DISCP PSM Comment", width: 400 },
    { value: "SC3 Comments", width: 400 },
    { value: "Final Recovery ETA" },
    { value: "CS Fulfillment Comments" },
    { value: "ESD_Aging", width: 120 },
    { value: "<-15D", width: 120 },
    { value: "-15D~-3D", width: 120 },
    { value: "-3D~0D", width: 120 },
    { value: "0D~10D", width: 120 },
    { value: "10D~30D", width: 120 },
    { value: "30D~60D", width: 120 },
    { value: "60D~90D", width: 120 },
    { value: ">=90D", width: 120 },
    
  ]);

  const [data, setData] = useState([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/shortage/partnums`)
      .then(response => response.json())
      .then(data => {
        const formattedData = data.map((item, index) => ({
          columns: Object.keys(item).map(key => ({ value: item[key] !== null ? item[key] : "NULL" })),
          id: `row-id-${index + 1}`
        }));
        setData(formattedData);
        setTotalItems(formattedData.length);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);
  
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/shortage/distinctcspartnumcount`)
      .then(response => response.json())
      .then(data => {
        setDistinctCSPartNumCount(data[0].DistinctPartNumCount);
      })
      .catch(error => {
        console.error("Error fetching distinct part number count:", error);
      });
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/shortage/distinctpartnumcount`)
      .then(response => response.json())
      .then(data => {
        const formattedCount = data[0].DistinctPartNumCount.toLocaleString();
        setDistinctPartNumCount(formattedCount);
      })
      .catch(error => {
        console.error("Error fetching distinct part number count:", error);
      });
  }, []);
  
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/shortage/totalqty`)
      .then(response => response.json())
      .then(data => {
        setTotalQty(data[0].TOTAL_UNIT.toLocaleString()); // 修改这里以匹配你的数据结构
      })
      .catch(error => {
        console.error("Error fetching total quantity:", error);
      });
  }, []);
  
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/shortage/salesordernumbercounts`)
      .then(response => response.json())
      .then(data => {
        setTotalSalesOrderCount(data[0].TotalSalesOrderCount.toLocaleString());
      })
      .catch(error => {
        console.error("Error fetching total sales order count:", error);
      });
  }, []);

  
  

  return (
    <div>
      <div style={{height: '200px',
      backgroundColor: '#f5f6f7',
      borderBottom: '1px solid #d3d3d3',
      display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: '40px'}}>
      <h1 className='dds__h2'>Shortage Report</h1>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* <DDSBadge color="warning" emphasis="medium">
          Note
        </DDSBadge> */}
        <p style={{ marginLeft: '10px' }}>It is to show the details of CS shortage parts and the impact to CS orders.</p>
      </div>
      
      </div>
      <div className="dds__container" style={{ marginTop: '20px' }}>
  <div className="dds__row dds__mb-4 dds__align-items-center">
    <div className="dds__col">
        <div className="dds__row">
  <div className="dds__col-12 dds__col--sm-6 dds__col--md-3 dds__mb-3">
    <div className="ddv__metrics">
      <div className="dds__card">
        <div className="dds__card__content">
          <div className="dds__card__header">
            <div className="dds__icon dds__card__header__icon dds__icon--device-laptop-detachable"></div>
            <span className="ddv__metrics__content" style={{ fontSize: "15px" }}>Total Shortage PartNumbers</span>
          </div>
          <div className="dds__card__body">
            <span className="ddv__metrics__value" style={{ fontSize: "40px" }}>
              {distinctPartNumCount ? distinctPartNumCount : <DDSLoadingIndicator size='md'></DDSLoadingIndicator>}
            </span>
          </div>
          <div className="dds__card__footer ddv__metrics__content">Aggregated by day</div>
        </div>
      </div>
    </div>
  </div>
  <div className="dds__col-12 dds__col--sm-6 dds__col--md-3 dds__mb-3">
    <div className="ddv__metrics">
      <div className="dds__card">
        <div className="dds__card__content">
          <div className="dds__card__header">
            <div className="dds__icon dds__card__header__icon dds__icon--device-laptop-detachable"></div>
            <span className="ddv__metrics__content" style={{ fontSize: "15px" }}>Total (CS) Shortage PartNums</span>
          </div>
          <div className="dds__card__body">
            <span className="ddv__metrics__value" style={{ fontSize: "40px" }}>
            {distinctCSPartNumCount ? distinctCSPartNumCount : <DDSLoadingIndicator size='md'></DDSLoadingIndicator>}
            </span>
          </div>
          <div className="dds__card__footer ddv__metrics__content">Aggregated by day</div>
        </div>
      </div>
    </div>
  </div>
  <div className="dds__col-12 dds__col--sm-6 dds__col--md-3 dds__mb-3">
    <div className="ddv__metrics">
      <div className="dds__card">
        <div className="dds__card__content">
          <div className="dds__card__header">
            <div className="dds__icon dds__card__header__icon dds__icon--cart"></div>
            <span className="ddv__metrics__content" style={{ fontSize: "15px" }}>Total CS Orders Impacted By Shortage</span>
          </div>
          <div className="dds__card__body">
            <span className="ddv__metrics__value" style={{ fontSize: "40px" }}>
              {totalSalesOrderCount ? totalSalesOrderCount : <DDSLoadingIndicator size='md'></DDSLoadingIndicator>}
            </span>
          </div>
          <div className="dds__card__footer ddv__metrics__content">Aggregated by day</div>
        </div>
      </div>
    </div>
  </div>
  <div className="dds__col-12 dds__col--sm-6 dds__col--md-3 dds__mb-3">
    <div className="ddv__metrics">
      <div className="dds__card">
        <div className="dds__card__content">
          <div className="dds__card__header">
            <div className="dds__icon dds__card__header__icon dds__icon--cart"></div>
            <span className="ddv__metrics__content" style={{ fontSize: "15px" }}>Total CS Units Impacted By Shortage</span>
          </div>
          <div className="dds__card__body">
          <span className="ddv__metrics__value" style={{ fontSize: "40px" }}>
              {totalQty ? totalQty : <DDSLoadingIndicator size='md'></DDSLoadingIndicator>}
            </span>
          </div>
          <div className="dds__card__footer ddv__metrics__content">Aggregated by day</div>
        </div>
      </div>
    </div>
  </div>
</div>
      
      <DDVBarChart chartOptions={chartOptions} />
      <DDVBarChart_ chartOptions_={chartOptions_} />
      {/* 高级数据展示 */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
    <DDSButton onClick={exportData} style={{ marginRight: '10px' }} icon="arrow-export" iconPlacement="end">
      Export
    </DDSButton>
    <FileUpload />
    <div style={{ marginLeft: '10px' }}>
    <DDSTooltip placement="right" title="Instruction" trigger={<DDSLink href="#" icon="help-cir" kind="standalone" />}>
      You can export the below data and update CS Fulfillment Comments in the field of "CS Fulfillment Comments" and then upload.
    </DDSTooltip>
    </div>
  </div>
      <p></p>
    </div>
  </div>
  <div className="dds__row">
    <div className="dds__col--12">
      <div style={{ overflowX: 'auto' }}>
        <DDSTable
          columnFilter
          columns={columns}
          data={data}
          pagination={{ currentPage, pageSize, onTotalItemsChange: setTotalItems }}
        />
      </div>
      <DDSPagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        pageSizeOptions={[6, 8]}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  </div>
</div>
    </div>
  );
};

export default ShortageReport;