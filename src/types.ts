export interface Signal {
  id: string;
  name: string;
  expression: string;
  points?: number[];
  samplingRate: number;
  startTime: number;
  endTime: number;
}

export interface SignalProperties {
  isPeriodic: boolean;
  isEven: boolean;
  isOdd: boolean;
  energy: number;
  power: number;
}

export type PlotType = 'time' | 'frequency' | 'overlay';

export type SignalOperation = 'add' | 'subtract' | 'multiply' | 'divide' | 'convolve' | 'correlate';

export type SignalTransformation = 'amplify' | 'attenuate' | 'shift' | 'compress' | 'expand';

export interface SignalOperationParams {
  operation: SignalOperation;
  signal1Id: string;
  signal2Id: string;
  factor?: number;
}

export interface SignalTransformationParams {
  transformation: SignalTransformation;
  signalId: string;
  factor: number;
}