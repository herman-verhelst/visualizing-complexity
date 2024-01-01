import {AppTime} from "./app-time";
import {Winner} from "./winner";
import Gradient from "./gradient";

export interface Edition {
  edition: number;
  year: number;
  distance: number;
  totalStages: number;
  stageWins: number;
  stagesLed: number;
  marginNumber: number;
  margin: AppTime;
  time: AppTime;
  winner: Winner;
  multipleWins: boolean;
  backgroundGradient?: Gradient;
}
