

document.addEventListener('DOMContentLoaded', () => {


  class Table {
    constructor(urlData, tableSelector) {
      this.urlData = urlData;
      this.data = null;
      this.tableSelector = tableSelector;
    }

    async getData() {
      try {
        const response = await fetch(this.urlData);
        const result = await response.json();

        this.data = result;
        this.updateTable();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    getDataInstance() {
      return this.data;
    }

    updateTable() {
      const allRowTable = document.querySelectorAll(`${this.tableSelector} tr`);
      if (!this.data) return;

      allRowTable.forEach((row, indexRow) => {
        const cells = row.querySelectorAll('td');

        cells.forEach((cell) => {
          const valueAttr = cell.dataset.column;
          if (this.data[indexRow] && this.data[indexRow][valueAttr] !== 'undefined') {
            console.log(this.data[indexRow]);
            if (cell.dataset.column === "yesterday") {

              const number = this.data[indexRow][valueAttr].split(' ')[0];
              const percent = this.data[indexRow][valueAttr].split(' ')[1];
              console.log(number);
              cell.innerHTML = `<span>${number}</span> <span class="percent">${percent}</span>`
              return;
            }
            cell.textContent = this.data[indexRow][valueAttr];
          }
        });
      });
    }
  }






  (async () => {
    const chartRow = document.getElementById('chart-row'); // Строка для графика
    const chartContainer = document.getElementById('chart-container'); // Контейнер для графика
    const url = './data.json';
    const tableSelector = '#table1';
    const table = new Table(url, tableSelector);
    const elementsColumnYesterday = document.querySelectorAll('[data-column="yesterday"]');

    await table.getData();
    addClickHandlers(table.getDataInstance());

    const changeColorCell = () => {

      elementsColumnYesterday.forEach(el => {
        let valuePercent = parseFloat(el.textContent.split(' ')[1]);

        if (valuePercent === 0) {
          el.classList.remove('red', 'green');
        } else {
          if (valuePercent < 0) {
            el.classList.add('red');
            el.classList.remove('green');
          } else {
            el.classList.add('green');
            el.classList.remove('red');
          }
        }

      })
    }

    changeColorCell();

    function addClickHandlers(data) {

      const tableRows = document.querySelectorAll('#table1 tr'); // Получаем все строки таблицы

      tableRows.forEach((row, index) => {
        row.addEventListener('click', function () {
          const item = data[index]; // Получаем данные для текущей строки
          const indicatorName = item.indicator; // Получаем имя показателя
          const currentData = item.current_day; // Текущий день
          const yesterdayData = Number(item.yesterday.split(' ')[0]); // Получаем только значение из ячейки "Вчера"
          const weekData = item.week_day; // Этот день недели

          // Настройка данных для графика
          const chartData = {
            title: {
              text: `Данные по ${indicatorName}` // Заголовок графика
            },
            xAxis: {
              categories: ['Текущий день', 'Вчера', 'Этот день недели'] // Категории по оси X
            },
            series: [{
              name: indicatorName,
              data: [currentData, yesterdayData, weekData] // Данные для графика
            }]
          };

          // Проверяем, есть ли уже открытая строка с графиком
          const existingChartRow = document.getElementById('chart-row');
          if (existingChartRow) {
            existingChartRow.remove();

            return;
          }

          // Создаем новую строку для графика
          const newChartRow = document.createElement('tr');
          newChartRow.id = 'chart-row';
          newChartRow.style.display = 'table-row';
          newChartRow.innerHTML = `
                  <td colspan="4">
                      <div id="chart-container" style="width: 100%; height: 400px;"></div>
                  </td>
              `;

          this.insertAdjacentElement('afterend', newChartRow);

          Highcharts.chart('chart-container', chartData);
        });
      });
    }

  })()

})







