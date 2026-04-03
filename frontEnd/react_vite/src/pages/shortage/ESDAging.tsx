import  { useEffect } from 'react';
import { Bar } from "@dds/dv-components";

// const chartOptions_ = {
//     tooltip: { prefix: "$", prefixSr: "dollars", unit: "M", unitSr: "millions" },
//     translations: {},
//     alignment: "vertical",
//     data: [],
//     fieldId: "name",
//     target: "#bar_target",
//     xAxes: { title: "Count" },
//     yAxes: { title: "ESD Aging" },
//   };
  
  const DDVBarChart1 = ({ chartOptions_ }) => {
    useEffect(() => {
      fetch("http://localhost:3000/api/shortage/esdagingcounts")
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
      <div className={`ddv__root`}>
        <div className="dds__container-fluid">
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
                    <div id="bar_target" data-ddv={`bar`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default DDVBarChart1;