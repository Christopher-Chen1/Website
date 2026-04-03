import { useEffect, useRef } from "react";
import * as DDV from "@dds/dv-components";

const DDVChart = (props: any) => {
  const chartRef: any = useRef(null);
  const chartCreated = useRef(false);
  const refId = props.chartOptions.target.replace(/#/g, ``);
  useEffect(() => {
      if (!chartCreated.current && props.chartOptions.data.length > 0) {
          // console.log("one", props);
        const chart = DDV[props["data-component"]]({ ...props.chartOptions });
        chartRef.current.chart = chart;
        chartCreated.current = true;
      }
  }, [props.chartOptions]);

  return (
    // <div id={props["data-id"]} className="dds__container-fluid">
    //   <div className="dds__row">
        <div className="dds__col-12 dds__col--md-12 dds__col--lg-12 dds__mb-3">
          <div className="dds__card">
            <div className="dds__card__content">
              <div className="dds__card__header">
                <span className="dds__card__header__text">
                  <h5 className="dds__card__header__title" tabIndex={1}>
                    {props["data-title"]}
                  </h5>
                  <span className="dds__card__header__subtitle" tabIndex={1}>
                    {props["data-subtitle"]}
                  </span>
                </span>
              </div>
              <div className="dds__card__body">
                <div
                  ref={chartRef}
                  id={refId}
                  data-ddv={props["data-ddv"]}
                  style={{ width: "100%", height: "520px" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
//     </div>
//    </div>
  );
};

export default DDVChart;