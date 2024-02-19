export interface CoolingCDU {
  timestamp: string;
  xname: string;
  row: number;
  col: number;
  rack_1_power: number;
  rack_2_power: number;
  rack_3_power: number;
  total_power: number;
  rack_1_loss: number;
  rack_2_loss: number;
  rack_3_loss: number;
  total_loss: number;
  liquid_inlet_0_flow_primary: number;
  liquid_inlet_0_temperature_primary: number;
  liquid_outlet_0_temperature_primary: number;
  liquid_inlet_0_pressure_primary: number;
  liquid_outlet_0_pressure_primary: number;
  liquid_outlet_0_flow_secondary: number;
  liquid_inlet_1_temperature_secondary: number;
  liquid_outlet_1_temperature_secondary: number;
  liquid_inlet_1_pressure_secondary: number;
  liquid_outlet_1_pressure_secondary: number;
  pump_1_input_pressure_secondary: number;
}
