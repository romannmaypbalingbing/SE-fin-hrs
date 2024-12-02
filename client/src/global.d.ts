// src/global.d.ts

declare module '../components/Stepper' {
    import { FC } from 'react';
  
    interface StepperProps {
      currentStep: number;
      steps: string[];
      onStepChange?: (step: number) => void;
    }
  
    const Stepper: FC<StepperProps>;
    export default Stepper;
  }
  
  // Add other module declarations here as needed