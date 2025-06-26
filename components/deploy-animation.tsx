"use client";

import { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEmbeddedWalletDelegated } from "@/lib/agent/utils";
import { Button } from "@/components/ui/button";

interface DeployAnimationProps {
  onComplete?: () => void;
  onRedirect?: () => void;
  onDelegate?: () => Promise<void>;
  className?: string;
  redirectDelay?: number;
}

const steps = [
  { id: 1, title: "Initiating Ethy Agent on Base", description: "Setting up core systems" },
  { id: 2, title: "Creating new Agent Wallet", description: "Generating secure wallet" },
  { id: 3, title: "Preparing Smart Automations", description: "Training neural networks" },
  { id: 4, title: "Finalizing Agent Deployment", description: "Completing deployment" },
];

export function DeployAnimation({ 
  onComplete, 
  onRedirect, 
  onDelegate,
  className, 
  redirectDelay = 3000 
}: DeployAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isDeploymentComplete, setIsDeploymentComplete] = useState(false);
  const [isDelegating, setIsDelegating] = useState(false);
  const [showDelegateButton, setShowDelegateButton] = useState(false);

  const { wallet: embeddedWallet, isAlreadyDelegated, ready: walletReady } = useEmbeddedWalletDelegated();
  
  useEffect(() => {
    const stepDurations = [3000, 2500, 3000, 3500]; // Duration for each step in ms
    
    const processSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        // Wait for the step duration
        await new Promise(resolve => setTimeout(resolve, stepDurations[i]));
        
        // Mark step as completed
        setCompletedSteps(prev => [...prev, i]);
        setCurrentStep(i + 1);
      }
      
      // All steps completed
      setTimeout(() => {
        setIsDeploymentComplete(true);
        onComplete?.();
        
        // Show delegate button instead of automatic redirect
        setShowDelegateButton(true);
      }, 1000);
    };

    processSteps();
  }, [onComplete]);

  // Handle redirect for already delegated wallets
  useEffect(() => {
    if (showDelegateButton && isAlreadyDelegated) {
      const timer = setTimeout(() => {
        onRedirect?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showDelegateButton, isAlreadyDelegated, onRedirect]);

  const handleDelegate = async () => {
    if (!onDelegate) return;
    
    setIsDelegating(true);
    try {
      await onDelegate();
      // Redirect after successful delegation
      setTimeout(() => {
        onRedirect?.();
      }, 1000);
    } catch (error) {
      console.error("Delegation failed:", error);
      setIsDelegating(false);
    }
  };

  if (isDeploymentComplete) {
    return (
      <div className={cn("w-full max-w-md mx-auto p-6 text-center", className)}>
        <div className="">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <Check className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          
          <div className="">
            <h2 className="text-3xl font-bold text-foreground">
              Agent Deployed
            </h2>
            {/* Show wallet address */}
            {embeddedWallet?.address && (
              <div className="mt-2 p-3">
                <p className="text-sm font-mono text-foreground break-all">
                  {embeddedWallet.address}
                </p>
              </div>
            )}
            
            {/* Show delegation status */}
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-violeta">Action Required</span>
                <br />
                To enable autonomous execution, Ethy needs delegated access to your wallet. Your wallet remains non-custodial, secured via Privy technology. You can revoke access at any time.
              </p>
            </div>
            
            {/* Show delegate button if not already delegated */}
            {showDelegateButton && !isAlreadyDelegated && (
              <div className="mt-4">
                <Button 
                  onClick={handleDelegate}
                  disabled={isDelegating}
                  className="w-full"
                >
                  {isDelegating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Confirming Delegation...
                    </>
                  ) : (
                    "Delegate Wallet"
                  )}
                </Button>
              </div>
            )}
            
            {/* Show redirect message if already delegated */}
            {showDelegateButton && isAlreadyDelegated && (
              <div className="mt-4">
                <p className="text-muted-foreground">
                  Redirecting...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-md mx-auto p-6", className)}>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Deploying Your Agent
          </h2>
          <p className="text-muted-foreground">
            Please wait while we set up your AI agent...
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const isActive = currentStep === index;
            const isCompleted = completedSteps.includes(index);
            const isPending = currentStep < index;

            return (
              <div
                key={step.id}
                className="flex items-center space-x-4 transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-emerald-500" />
                  ) : isActive ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs font-medium text-muted-foreground">
                        {step.id}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      "font-medium transition-colors",
                      isActive && "text-primary",
                      isCompleted && "text-emerald-600 dark:text-emerald-400",
                      isPending && "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

//