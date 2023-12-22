import {AppTime} from "./appTime";
import {Winner} from "./winner";

export interface Edition {
  edition: number;
  year: number;
  distance: number;
  totalStages: number;
  stageWins: number;
  stagesLed: number;
  margin: AppTime;
  time: AppTime;
  winner: Winner;
}
