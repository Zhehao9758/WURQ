import { observable, action } from 'mobx';

interface ChartDataset {
  data: number[];
}

interface ExerciseData {

}

interface ChartData {
  labels: number[];
  datasets: ChartDataset[];
}

interface DataStoreState {
  chartData: ChartData;
  date_time: string;
  name: string;
  time: number;
  rest: number;
  hr: number;
  points: number;
  exercises: string;
}

class DataStore {
  @observable data: DataStoreState = {
    chartData: { labels: [], datasets: [] },
    date_time: "",
    name: "",
    time: 0,
    rest: 0,
    hr: 0,
    points: 0,
    exercises: "",
  };

  @action updateData(newData) {
    const n = newData.points_per_wod.length
    this.data.chartData.labels = Array.from({ length: n }, (_, index) => index + 1);
    this.data.chartData.datasets = [{ data: newData.points_per_wod }]
    this.data.date_time = newData.history[0].date_time
    this.data.name = newData.history[0].name
    this.data.time = newData.history[0].time
    this.data.rest = newData.history[0].rest
    this.data.hr = newData.history[0].hr
    this.data.points = newData.history[0].points
    this.data.exercises = newData.history[0].exercises
  }

  @action updateName(name: string) {
    this.data.name = name;
  }
  @action updatePoints(points: number) {
    this.data.points = points;
  }
}

export default new DataStore();
