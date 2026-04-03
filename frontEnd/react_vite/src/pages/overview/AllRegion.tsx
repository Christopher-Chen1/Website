import { useEffect, useState } from 'react';
import DDVChart from './Example/DDVChart';
import { DDSLoadingIndicator } from '@dds/react';

const Overview = () => {

  //data

  const [reportDate, setReportDate] = useState('');
  const [totalOrderQty, setTotalOrderQty] = useState(0);
  const [totalSystemQty, setTotalSystemQty] = useState(0);
  const [serviceFeeRev, setServiceFeeRev] = useState(0);
  const [regionData, setRegionData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [stackedBarData, setStackedBarData] = useState([]);
  const [backlogByStatusData, setBacklogByStatusData] = useState([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/all/order-status`)
      .then(response => response.json())
      .then(data => {
        const order = ['(Blank)', 'PI', 'MI', 'MN', 'PC', 'SC', 'HL', 'PP', 'WF', 'IP', 'RJ'];
        const formattedData = data.reduce((acc, item) => {
          const { region, orderStatus, salesNum } = item;
          const category = orderStatus === null ? "(Blank)" : orderStatus;
          const existingCategory = acc.find(entry => entry.category === category);
          if (existingCategory) {
            existingCategory[region] = salesNum;
          } else {
            acc.push({ category, [region]: salesNum });
          }
          return acc;
        }, []).sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
        setBacklogByStatusData(formattedData);
      })
      .catch(error => console.error('Error fetching order status data:', error));
  }, []);


  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/data/report-date`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          setReportDate(data[0]['Report Date']);
        }
        setLoading(false);
      })
      .catch(error => console.error('Error fetching report date:', error));
      setLoading(false);
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/all/total-order-qty`)
      .then(response => response.json())
      .then(data => {
        const formattedQty = data.TotalOrderQTY.toLocaleString();
        setTotalOrderQty(formattedQty);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching total order qty:', error));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/all/total-system-qty`)
      .then(response => response.json())
      .then(data => {
        const roundedQty = Math.round(data.TotalSystemQTY / 1000);
        setTotalSystemQty(roundedQty);
      })
      .catch(error => console.error('Error fetching total system qty:', error));
  }, []);
  
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/all/service-fee-rev`)
      .then(response => response.json())
      .then(data => {
        const millionRev = data.ServiceFeeRev / 1_000_000;
        setServiceFeeRev(millionRev);
      })
      .catch(error => console.error('Error fetching service fee rev:', error));
  }, []);

  const formattedServiceFeeRev = serviceFeeRev !== null ? serviceFeeRev.toFixed(2) + 'M' : null;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/all/country-data`)
      .then(response => response.json())
      .then(data => {
        const formattedData = data
          .filter(item => item.TotalValue > 300)
          .map(item => ({
            category: item["Country Desc"] || "Unknown",
            value: item.TotalValue
          }));
        // console.log('Formatted Data:', formattedData); // 添加日志
        setCountryData(formattedData);
        
      })
      .catch(error => console.error('Error fetching country data:', error));
      
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/all/region-data`)
      .then(response => response.json())
      .then(data => {
        const formattedData = data
          .map(item => ({
            category: item["Region Desc"] || "Unknown",
            value: item.TotalValue
          }));
        // console.log('Formatted Data:', formattedData); // 添加日志
        setRegionData(formattedData);
        
      })
      .catch(error => console.error('Error fetching country data:', error));
      
  }, []);

  
  // console.log('Loading state:', loading);
  
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/all/esd-range`)
      .then(response => response.json())
      .then(data => {
        const order = [
          '<-365 days', '-365~-90 days', '-90~-60 days', '-60~-30 days', 
          '-30~-10 days', '-10~-5 days', '-5~0 days', '0~5 days', '5~10 days', 
          '10~30 days', '30~60 days', '60~90 days', '90~365 days', '>365 days', '(Blank)'
        ];
  
        // 辅助函数：标准化category名称，确保它们与order数组中的项匹配
        const normalizeCategory = (category) => {
          // 去掉括号
          let normalized = category.replace(/[()]/g, ''); // 去除所有括号
  
          // 针对特定情况做格式调整
          if (normalized === 'Blank') {
            return '(Blank)';
          }
          if (normalized === '< -365 days') {
            return '<-365 days';
          }
          if (normalized === '> 365 days') {
            return '>365 days';
          }
          
          return normalized;
        };
  
        const formattedData = data
          .reduce((acc, item) => {
            const { region, daysFromTodayCategory, salesNum } = item;
            const normalizedCategory = normalizeCategory(daysFromTodayCategory); // 标准化并去掉括号
            const existingCategory = acc.find(entry => entry.category === normalizedCategory);
            if (existingCategory) {
              existingCategory[region] = salesNum;
            } else {
              acc.push({ category: normalizedCategory, [region]: salesNum });
            }
            return acc;
          }, [])
          .sort((a, b) => {
            const indexA = order.indexOf(a.category) !== -1 ? order.indexOf(a.category) : Infinity;
            const indexB = order.indexOf(b.category) !== -1 ? order.indexOf(b.category) : Infinity;
            return indexA - indexB;
          });
  
        // console.log('Formatted Data:', formattedData); // 调试输出
        setStackedBarData(formattedData);
      })
      .catch(error => console.error('Error fetching ESD range data:', error));
  }, []);
  
  
  

  //console.log('Country Data:', countryData);
  const options = {
    backlogByCountry: {
      target: "#pie-chart",
      data: countryData || [],
      tooltip: { prefix: "Count of Sales_Order_Num", prefixSr: "dollars", unit: "", unitSr: "millions" },
    },
    backlogByRegion: {
      target: "#pie_3464719651",
      data: regionData || [],
      tooltip: { prefix: "Count of Sales_Order_Num", prefixSr: "dollars", unit: "", unitSr: "millions" },
    },
    stackedbar: {
      target: "#stacked-bar_1971633142",
      sanitize: false,
      data: stackedBarData || [],
      xAxes: { title: "Ship By Date Aging Range" },
      yAxes: { title: "Count of Sales Order Num" },
    },
    backlogByStatus: {
      target: "#stacked-bar_1971633131",
      data: backlogByStatusData || [],
      xAxes: { title: "Order Status" },
      yAxes: { title: "Count of Sales Order Num" },
    },

    

  }
  //console.log('Pie Chart options', options.pie);


    return  (
      <div className="dds__container">
      <div className="dds__row">
        <h2 style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          Reported Date: <span>{reportDate ? reportDate : <DDSLoadingIndicator size='md'></DDSLoadingIndicator>}</span>
        </h2>
      </div>
    
      <div className="dds__row">
        <div className="dds__col-12 dds__col--sm-6 dds__col--md-4 dds__mb-3">
          <div className="ddv__metrics">
            <div className="dds__card">
              <div className="dds__card__content">
                <div className="dds__card__header">
                  <div className="dds__icon dds__card__header__icon dds__icon--cart"></div>
                  <span className="ddv__metrics__content" style={{ fontSize: "15px" }}>Total Order QTY</span>
                </div>
                <div className="dds__card__body">
                  <span className="ddv__metrics__value" style={{ fontSize: "40px" }}>
                    {totalOrderQty ? totalOrderQty : <DDSLoadingIndicator size='md'></DDSLoadingIndicator>}
                  </span>
                </div>
                <div className="dds__card__footer ddv__metrics__content">Aggregated by day</div>
              </div>
            </div>
          </div>
        </div>
        <div className="dds__col-12 dds__col--sm-6 dds__col--md-4 dds__mb-3">
          <div className="ddv__metrics">
            <div className="dds__card">
              <div className="dds__card__content">
                <div className="dds__card__header">
                  <div className="dds__icon dds__card__header__icon dds__icon--device-laptop"></div>
                  <span className="ddv__metrics__content" style={{ fontSize: "15px" }}>Total System QTY</span>
                </div>
                <div className="dds__card__body">
                  <span className="ddv__metrics__value" style={{ fontSize: "40px" }}>
                    {totalSystemQty ? `${totalSystemQty}K` : <DDSLoadingIndicator size='md'></DDSLoadingIndicator>}
                  </span>
                </div>
                <div className="dds__card__footer ddv__metrics__content">Aggregated by day</div>
              </div>
            </div>
          </div>
        </div>
        <div className="dds__col-12 dds__col--sm-6 dds__col--md-4 dds__mb-3">
          <div className="ddv__metrics">
            <div className="dds__card">
              <div className="dds__card__content">
                <div className="dds__card__header">
                  <div className="dds__icon dds__card__header__icon dds__icon--currency"></div>
                  <span className="ddv__metrics__content" style={{ fontSize: "15px" }}>Service Fee Rev(USD)</span>
                </div>
                <div className="dds__card__body">
                  <span className="ddv__metrics__value" style={{ fontSize: "40px" }}>
                    {serviceFeeRev ? formattedServiceFeeRev : <DDSLoadingIndicator size='md'></DDSLoadingIndicator>}
                  </span>
                </div>
                <div className="dds__card__footer ddv__metrics__content">Aggregated by day</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='dds__row'>
          <DDVChart
            data-id="pie_3464719651"
            data-title="Backlog By Region"
            data-subtitle=""
            data-component="Pie"
            data-ddv="pie"
            chartOptions={options.backlogByRegion}
          />
      </div>
    
      <div className='dds__row'>
          <DDVChart
            data-id="pie-chart"
            data-title="Backlog By Country"
            data-subtitle=""
            data-component="Pie"
            data-ddv="pie"
            chartOptions={options.backlogByCountry}
          />
      </div>
    
      <div className='dds__row'>
        <DDVChart
          data-id="stacked-bar_1971633142"
          data-title="GCS Backlog By ESD Range"
          data-subtitle=""
          data-component="StackedBar"
          data-ddv="stacked-bar"
          chartOptions={options.stackedbar}
        />
      </div>
    
      <div className='dds__row'>
        <DDVChart
          data-id="stacked-bar_1971633131"
          data-title="GCS Backlog By Status"
          data-subtitle=""
          data-component="StackedBar"
          data-ddv="stacked-bar"
          chartOptions={options.backlogByStatus}
        />
      </div>
    </div>
  
  
  );
  };
  
  export default Overview;