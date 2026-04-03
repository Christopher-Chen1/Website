
import {  DDSButton, DDSMessageBar } from '@dds/react';
import DDVChart from './DDVChart';
import { useState } from 'react';
//import { DDSLoadingIndicator } from '@dds/react';

const SecondTouch = () => {

  const [isVisible, setIsVisible] = useState(true);

  
  const options = {
    // backlogByCountry: {
    //   target: "#pie-chart",
    //   data: countryData || [],
    // },
    backlogByFacility: {
      data: [
  { "Facility": "FedEx-DBM,ConUS", "Backlog": 5000 },
  { "Facility": "TSS - Austin", "Backlog": 3720 },
  { "Facility": "FedEx-CFS", "Backlog": 1203 },
  { "Facility": "Syncreon - Europe", "Backlog": 967 },
  { "Facility": "QSL - Sydney", "Backlog": 460 },
  { "Facility": "eBryIT - Atlanta", "Backlog": 249 },
  { "Facility": "YCH - Chengdu", "Backlog": 172 },
  { "Facility": "YCH - Kunshan", "Backlog": 156 },
  { "Facility": "Premier Logitech - US", "Backlog": 128 },
  { "Facility": "DCR - Canada", "Backlog": 106 },
  { "Facility": "ProLogic ITS - US", "Backlog": 4 },
      ],
      target: "#bar_2256213685",
      xAxes: { title: "" },
      yAxes: { title: "" },
    },
    holdOrderQTYByFacility: {
      target: "#stacked-bar-chart",
      data: [
        { "category": "FedEx-DBM,ConUS", "CS Hold": 50, "Customer Induced Hold": 300 },
  { "category": "TSS - Austin", "CS Hold": 44, "Customer Induced Hold": 213 },
  { "category": "FedEx-CFS", "CS Hold": 70, "Customer Induced Hold": 138 },
  { "category": "Syncreon - Europe", "CS Hold": 27, "Customer Induced Hold": 152 },
  { "category": "QSL - Sydney", "CS Hold": 35, "Customer Induced Hold": 280 },
  { "category": "eBryIT - Atlanta", "CS Hold": 49, "Customer Induced Hold": 200 },
  { "category": "YCH - Chengdu", "CS Hold": 38, "Customer Induced Hold": 183 },
  { "category": "YCH - Kunshan", "CS Hold": 28, "Customer Induced Hold": 157 },
  { "category": "Premier Logitech - US", "CS Hold": 19, "Customer Induced Hold": 105 },
  { "category": "DCR - Canada", "CS Hold": 9, "Customer Induced Hold": 84 },
  { "category": "ProLogic ITS - US", "CS Hold": 1, "Customer Induced Hold": 3 },
      ],
      xAxes: { title: "" },
      yAxes: { title: "" },
    },
    top10Customer: {
      target: "#bar-chart",
      data: [
        { "name": "(blank)", "points": 7160 },
  { "name": "IBM MANUFACTURING SOLUTIONS", "points": 2431 },
  { "name": "COLAS DIGITAL SOLUTIONS", "points": 200 },
  { "name": "HOME DEPOT EDI", "points": 178 },
  { "name": "INGRAM MICRO INDIA PRIVATE LIMITED", "points": 92 },
  { "name": "CARRIER ACCESS IT; LLC", "points": 57 },
  { "name": "Department of Health Queensland - CSG", "points": 56 },
  { "name": "TSS/VERSA-ST-OEM", "points": 54 },
  { "name": "FULL SWING GOLF - OEM", "points": 51 },
  { "name": "ORIENT TECHNOLOGIES LIMITED", "points": 47 },
      ],
      xAxes: { title: "" },
     yAxes: { title: "" },
    },
    backlogWhichMissSLA: {
      target: "#grouped-bar-chart",
      data: [
        { category: "FedEx-DBM,ConUS", "Not Customer Induced": 1188, "Customer Induced": 2842 },
  { category: "TSS - Austin", "Not Customer Induced": 1021, "Customer Induced": 2335 },
  { category: "Syncreon - Europe", "Not Customer Induced": 185, "Customer Induced": 429 },
  { category: "FedEx-CFS", "Not Customer Induced": 161, "Customer Induced": 387 },
  { category: "QSL - Sydney", "Not Customer Induced": 77, "Customer Induced": 154 },
  { category: "eBryIT - Atlanta", "Not Customer Induced": 71, "Customer Induced": 131 },
  { category: "YCH - Kunshan", "Not Customer Induced": 29, "Customer Induced": 78 },
  { category: "Premier Logitech - US", "Not Customer Induced": 30, "Customer Induced": 73 },
  { category: "YCH - Chengdu", "Not Customer Induced": 24, "Customer Induced": 60 },
  { category: "DCR - Canada", "Not Customer Induced": 20, "Customer Induced": 45 },

      ],
      xAxes: { title: "" },
      yAxes: { title: "" },
    },
    backlogByEDDAging: {
      target: "#grouped-bar_632650266",
      sanitize: false,
      data: [
        { category: "Safe", FedExDBMConUS: 594, TSSAustin: 510.5, SyncreonEurope: 92.5, FedExCFS: 80.5, QSLSydney: 38.5, eBryITAtlanta: 35.5, YCHKunshan: 14.5, PremierLogitechUS: 15, YCHChengdu: 12, DCRCanada: 10 },
  { category: "Potential Overdue(-2 ~0 days)", FedExDBMConUS: 297, TSSAustin: 255, SyncreonEurope: 46, FedExCFS: 40, QSLSydney: 19, eBryITAtlanta: 18, YCHKunshan: 7, PremierLogitechUS: 8, YCHChengdu: 6, DCRCanada: 5 },
  { category: "Overdue (0~5 days)", FedExDBMConUS: 178, TSSAustin: 153, SyncreonEurope: 28, FedExCFS: 24, QSLSydney: 12, eBryITAtlanta: 11, YCHKunshan: 4, PremierLogitechUS: 5, YCHChengdu: 4, DCRCanada: 3 },
  { category: "Overdue (>5 days)", FedExDBMConUS: 59, TSSAustin: 51, SyncreonEurope: 9, FedExCFS: 8, QSLSydney: 4, eBryITAtlanta: 4, YCHKunshan: 1, PremierLogitechUS: 2, YCHChengdu: 1, DCRCanada: 1 },
      ],
      xAxes: { title: "" },
      yAxes: { title: "" },
    },
    top10CustomerBacklogByEDDAging: {
      target: "#grouped-bar_632650256",
      data: [
        { category: "IBM MANUFACTURING SOLUTIONS", Safe: 713, "Potential Overdue(-2 ~0 days)": 356, "Overdue (0~5 days)": 238, "Overdue (>5 days)": 119 },
  { category: "COLAS DIGITAL SOLUTIONS", Safe: 613, "Potential Overdue(-2 ~0 days)": 306, "Overdue (0~5 days)": 204, "Overdue (>5 days)": 102 },
  { category: "HOME DEPOT EDI", Safe: 111, "Potential Overdue(-2 ~0 days)": 56, "Overdue (0~5 days)": 37, "Overdue (>5 days)": 19 },
  { category: "INGRAM MICRO INDIA PRIVATE LIMITED", Safe: 97, "Potential Overdue(-2 ~0 days)": 48, "Overdue (0~5 days)": 32, "Overdue (>5 days)": 16 },
  { category: "CARRIER ACCESS IT; LLC", Safe: 46, "Potential Overdue(-2 ~0 days)": 23, "Overdue (0~5 days)": 15, "Overdue (>5 days)": 8 },
  { category: "Department of Health Queensland - CSG", Safe: 43, "Potential Overdue(-2 ~0 days)": 21, "Overdue (0~5 days)": 14, "Overdue (>5 days)": 7 },
  { category: "TSS/VERSA-ST-OEM", Safe: 17, "Potential Overdue(-2 ~0 days)": 9, "Overdue (0~5 days)": 6, "Overdue (>5 days)": 3 },
  { category: "FULL SWING GOLF - OEM", Safe: 18, "Potential Overdue(-2 ~0 days)": 9, "Overdue (0~5 days)": 6, "Overdue (>5 days)": 3 },
  { category: "ORIENT TECHNOLOGIES LIMITED", Safe: 14, "Potential Overdue(-2 ~0 days)": 7, "Overdue (0~5 days)": 5, "Overdue (>5 days)": 2 },
  { category: "ALBIANT-IT", Safe: 12, "Potential Overdue(-2 ~0 days)": 6, "Overdue (0~5 days)": 4, "Overdue (>5 days)": 2 },
      ],
      xAxes: { title: "" },
    yAxes: { title: "" },
    },
    

    

  }
  //console.log('Pie Chart options', options.pie);


    return  (
    <div>
      <div style={{height: '200px',
      backgroundColor: '#f5f6f7',
      borderBottom: '1px solid #d3d3d3',
      display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: '40px'}}>
      <h1 className='dds__h2'>2T Report</h1>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* <DDSBadge color="warning" emphasis="medium">
          Note
        </DDSBadge>
        <p style={{ marginLeft: '10px' }}>This page is still under development and the data is just for testing.</p> */}
        {isVisible && (
      <DDSMessageBar color="warning" dismissible={false} icon="alert-info-cir" title={<b>Notice: </b>}>
        <>
        This page is still under development and the data is just for testing.{" "}
          {/* <a href="https://dell.com" target="_blank">
            Click here for more information.
          </a> */}
        </>
      </DDSMessageBar>
    )}
    {!isVisible && <DDSButton onClick={() => setIsVisible(true)}>Show message bar</DDSButton>}
      </div>
      
      </div>
      <div className="dds__container" style={{ marginTop: '20px' }}>
      
      {/* <DDSDivider kind="primary" /> */}
    <div className='dds__row'>
    
    </div>
    <div className='dds__row'>
    
    <DDVChart 
        data-id="bar_2256213685"
        data-title="Backlog By Facility"
        data-subtitle=""
        data-component="Bar"
        data-ddv="bar"
        chartOptions={options.backlogByFacility}
        />
    </div>
    <div className='dds__row'>
    
    <DDVChart 
        data-id="stacked-bar-chart"
        data-title="Hold Order QTY By Facility"
        data-subtitle=""
        data-component="StackedBar"
        data-ddv="stacked-bar"
        chartOptions={options.holdOrderQTYByFacility}/>
    </div>
    <div className='dds__row'>
    
    <DDVChart 
        data-id="bar-chart"
        data-title="Top 10 Customers"
        data-subtitle=""
        data-component="Bar"
        data-ddv="bar"
        chartOptions={options.top10Customer}/>
    </div>
    
    <div className='dds__row'>
    <DDVChart 
        data-id="grouped-bar-chart"
        data-title="Backlog Which Miss SLA(5 days)"
        data-subtitle=""
        data-component="GroupedBar"
        data-ddv="grouped-bar"
        chartOptions={options.backlogWhichMissSLA}/>
    </div>
    <div className='dds__row'>
    <DDVChart 
        data-id="grouped-bar_632650266"
        data-title="Backlog By EDD Aging"
        data-subtitle=""
        data-component="GroupedBar"
        data-ddv="grouped-bar"
        chartOptions={options.backlogByEDDAging}/>
    </div>
    <div className='dds__row'>
    <DDVChart 
        data-id="grouped-bar_632650256"
        data-title="Top 10 Customer Backlog By EDD Aging"
        data-subtitle=""
        data-component="GroupedBar"
        data-ddv="grouped-bar"
        chartOptions={options.top10CustomerBacklogByEDDAging}/>
    </div>

    
    <div className='dds__row'>
    {/* <BacklogByFacility chartOptionsFacility={chartOptionsFacility}/> */}
    
    </div>
        
  </div>
    </div>
  
  
  );
  };
  
  export default SecondTouch;