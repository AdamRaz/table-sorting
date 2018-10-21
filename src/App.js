import React, { Component } from 'react';
import './App.css';

class App extends Component {
  // AR - leave the headings, just use actual table data
  // AR - for now, edited csv bad commas, TODO: maybe regex to handle commas within quotes instead of Papa Parse, or just hard code the arrays to use below for sorting!
  state = {
    tableData: `2,New York City,United States,1390,803,257,66,7,2,1398
      1,Hong Kong,China,820,555,317,64,6,0,820
      6,Chicago,United States,524,317,119,29,6,1,526
      4,Tokyo,Japan,348,284,145,26,0,2,351
      3,Dubai,United Arab Emirates,370,266,176,68,20,0,370
      17,Toronto,Canada,487,241,54,18,0,1,489
      5,Shanghai,China,379,183,141,52,5,2,381
      29,Moscow,Russia,204,165,37,15,5,3,207
      11,Seoul,South Korea,158,138,82,18,1,1,159
      8,Chongqing,China,146,136,110,35,2,0,146
      10,Singapore,Singapore,203,129,84,32,0,1,204
      13,Jakarta,Indonesia,382,128,74,33,0,2,383
      7,Shenzhen,China,145,125,114,58,8,0,145
      9,Guangzhou,China,161,125,103,30,9,1,163
      33,Sydney,Australia,426,123,35,9,0,1,429
      26,Melbourne,Australia,207,115,40,13,0,4,211
      23,Miami,United States,124,98,41,3,0,0,125
      29,Houston,United States,195,91,37,15,2,1,196
      12,Chengdu,China,96,90,77,16,0,1,97
      28,Istanbul,Turkey,102,88,38,2,0,1,103
      44,San Francisco,United States,111,87,21,3,0,3,114
      15,Bangkok,Thailand,115,82,62,12,2,1,116
      14,Shenyang,China,80,79,72,10,2,1,81
      23,Mumbai,India,124,76,41,10,1,1,125
      68,São Paolo,Brazil,176,76,13,0,0,0,176
      17,Busan,South Korea,84,73,54,15,1,0,84
      19,Kuala Lumpur,Malaysia,104,70,53,21,3,1,107
      23,Osaka,Japan,76,70,41,5,1,1,78
      80,Buenos Aires,Argentina,80,69,10,0,0,0,80
      16,Nanjing,China,69,67,55,25,3,1,70
      41,Los Angeles,United States,95,67,24,12,2,0,95
      58,Atlanta,United States,90,67,16,10,1,2,92
      20,Panama City,Panama,79,66,51,22,0,0,79
      49,Mexico City,Mexico,99,66,19,4,0,1,100
      54,Calgary,Canada,90,63,17,4,1,1,91
      68,Brisbane,Australia,97,60,13,5,0,0,97
      54,London,United Kingdom,263,59,17,5,1,5,272`,
    locationArray: [],
    numberData: 0,
    comparisonIndex: 0,
    tableArray: [],

  }

  componentWillMount() {
    this.parseData();
  }

  parseData() {
    // AR - parse csv data with Papa Parse package
    // source - https://stackoverflow.com/questions/46849677/how-to-extract-data-to-react-state-from-csv-file-using-papa-parse
    let csv = this.state.tableData;
    let Papa = require("papaparse/papaparse.min.js");
    let results = Papa.parse(csv);
    let locationArray = results.data;
    this.setState({locationArray: locationArray});
    this.getUrlData(locationArray);
  } 

  getUrlData(locationArray) {
    // AR - get ending URL text
    let parsedUrl2 = window.location.href;
    let endUrlParam = parsedUrl2.split('/').pop();

    // AR - assuming spaces will be ignored for URL matching
    let comparisonIndex = 0;
    let numberData = 0;
    switch(endUrlParam.toLowerCase()) {
      case '#':
        comparisonIndex = 0;
        numberData = 1;
        break;
      case 'city':
        comparisonIndex = 1;
        numberData = 0;
        break;
      case 'country':
        comparisonIndex = 2;
        numberData = 0;
        break;
      case 'allbuildings':
        comparisonIndex = 3;
        numberData = 1;
        break;
      case '100m+':
        comparisonIndex = 4;
        numberData = 1;
        break;
      case '150m+':
        comparisonIndex = 5;
        numberData = 1;
        break;
      case '200m+':
        comparisonIndex = 6;
        numberData = 1;
        break;
      case '300m+':
        comparisonIndex = 7;
        numberData = 1;
        break;
      case 'telecomtowers':
        comparisonIndex = 8;
        numberData = 1;
        break;
      case 'allstructures':
        comparisonIndex = 9;
        numberData = 1;
        break;
      default:
        comparisonIndex = 0;
        numberData = 1;
        break;
    }

    this.setState({comparisonIndex: comparisonIndex});
    this.setState({numberData: numberData});
    this.sortTableData(locationArray, comparisonIndex, numberData);
  }

  sortTableData (locationArray, comparisonIndex, numberData) {
    console.log(locationArray);
    // AR - sorting array based on url parameter
    // source - https://stackoverflow.com/questions/5435228/sort-an-array-with-arrays-in-it-by-string
    function compareText(index) {
      return function compareText(a, b) {
        if (a[index] > b[index]) {
          return 1;
        }
        if (a[index] < b[index]) {
          return -1;
        }
        return 0;
      }
    }

    function compareNumbers(index) {
      return function compareNumbers(a, b) {
        return a[index] - b[index];
      }
    }

    let sortedArray = [];
    // AR - based on what the column data is (text/numeric) sort the data array by passing the relevant column index of the data to sort by (from URL parameter) and using a custom comparison function
    if (numberData === 0) {
      sortedArray = locationArray.sort(compareText(comparisonIndex));
    } else {
      sortedArray = locationArray.sort(compareNumbers(comparisonIndex));
    }

    this.setState({tableArray: sortedArray});
  }

  render() {
    let renderTableArray = this.state.tableArray;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Sorting a table based on URL</h1>
        </header>
        <p className="App-intro">
          Enter a table heading without spaces (e.g. # or city or 100m+ or allstructures) at the end of the URL for this page to sort the below table according to that column's data.
          <br/>
          This page uses React and Papa Parse.
        </p>
        <table className="city-table">
          <thead> 
            <tr> 
              <th>#</th> 
              <th>City</th> 
              <th>Country</th> 
              <th>All Buildings</th> 
              <th>100m+</th> 
              <th>150m+</th> 
              <th>200m+</th> 
              <th>300m+</th> 
              <th>Telecom Towers</th> 
              <th>All Structures</th> 
            </tr>
          </thead>
          <tbody>
            {renderTableArray.map((tableRow, index) => 
              <tr key={index}> 
                <td>{tableRow[0]}</td> 
                <td>{tableRow[1]}</td> 
                <td>{tableRow[2]}</td> 
                <td>{tableRow[3]}</td> 
                <td>{tableRow[4]}</td> 
                <td>{tableRow[5]}</td> 
                <td>{tableRow[6]}</td> 
                <td>{tableRow[7]}</td> 
                <td>{tableRow[8]}</td> 
                <td>{tableRow[9]}</td> 
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
